const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const preload = path.join(__dirname, 'fixtures/mock-dependencies.js');
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'miniprogram-deploy-test-'));
let passed = 0;
let failed = 0;

function fixture() {
    const cwd = fs.mkdtempSync(path.join(temporaryRoot, 'project-'));
    const projectPath = path.join(cwd, 'project');
    fs.mkdirSync(projectPath);
    fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({ version: '1.2.3' }));
    fs.writeFileSync(path.join(projectPath, 'project.config.json'), JSON.stringify({
        appid: 'test-app-id', setting: { es6: true }
    }));
    const config = {
        type: 'miniProgram',
        privateKeyPath: './unused-test.key',
        projectPath
    };
    const configPath = path.join(cwd, 'mp-deploy.config.json');
    fs.writeFileSync(configPath, JSON.stringify(config));
    return { cwd, projectPath, config, configPath };
}

function run(context, command, options = {}) {
    const trace = path.join(context.cwd, 'upload-trace.json');
    const result = spawnSync(process.execPath, [
        '--unhandled-rejections=strict', '-r', preload,
        options.operation ? path.join(__dirname, 'fixtures/check-promise.js') : path.join(root, 'bin/index.js'),
        command
    ], {
        cwd: context.cwd,
        encoding: 'utf8',
        timeout: 10000,
        env: {
            ...process.env,
            TEST_SCENARIO: options.scenario || '',
            TEST_CPU_COUNT: options.cpuCount === undefined ? '4' : String(options.cpuCount),
            TEST_UPLOAD_TRACE: trace,
            TEST_OPERATION: options.operation || '',
            FORCE_COLOR: '0'
        }
    });
    assert.ifError(result.error);
    assert.strictEqual(result.signal, null, result.stderr);
    return { ...result, output: result.stdout + result.stderr, trace };
}

function test(name, fn) {
    try {
        fn(fixture());
        passed++;
        console.log(`ok - ${name}`);
    } catch (error) {
        failed++;
        console.error(`not ok - ${name}\n${error.stack}`);
    }
}

function expectStatus(result, status) {
    assert.strictEqual(result.status, status, result.output);
}

try {
    test('doctor succeeds with valid configuration', context => {
        expectStatus(run(context, 'doctor'), 0);
    });
    for (const command of ['doctor', 'upload']) {
        for (const invalid of ['missing', 'malformed', 'schema']) {
            test(`${command} fails with ${invalid} configuration`, context => {
                if (invalid === 'missing') fs.unlinkSync(context.configPath);
                else fs.writeFileSync(context.configPath, invalid === 'malformed' ? '{' : '{}');
                const result = run(context, command);
                expectStatus(result, 1);
                assert(!fs.existsSync(result.trace), 'Invalid configuration must not upload');
            });
        }
    }
    test('upload succeeds and preserves defaults, settings, progress and package output', context => {
        const result = run(context, 'upload');
        expectStatus(result, 0);
        const trace = JSON.parse(fs.readFileSync(result.trace, 'utf8'));
        assert.strictEqual(trace.version, '1.2.3');
        assert.strictEqual(trace.desc, 'mock commit message');
        assert.deepStrictEqual(trace.setting, { es6: true, minify: true });
        assert.strictEqual(trace.project.appid, 'test-app-id');
        assert(result.output.includes('[Compile] app.js'));
        assert(result.output.includes('uploaded package information table'));
        assert(result.output.includes('1.00 KB'));
    });
    test('upload uses the CPU count rather than function arity', context => {
        const result = run(context, 'upload');
        assert.strictEqual(JSON.parse(fs.readFileSync(result.trace, 'utf8')).threads, 4);
        expectStatus(result, 0);
    });
    test('upload uses at least one thread when CPU information is unavailable', context => {
        const result = run(context, 'upload', { cpuCount: 0 });
        assert.strictEqual(JSON.parse(fs.readFileSync(result.trace, 'utf8')).threads, 1);
        expectStatus(result, 0);
    });
    test('upload respects explicit version and description', context => {
        fs.writeFileSync(context.configPath, JSON.stringify({ ...context.config, version: '9.8.7', desc: 'custom notes' }));
        const result = run(context, 'upload');
        expectStatus(result, 0);
        const trace = JSON.parse(fs.readFileSync(result.trace, 'utf8'));
        assert.strictEqual(trace.version, '9.8.7');
        assert.strictEqual(trace.desc, 'custom notes');
    });
    test('upload fails when project.config.json is missing', context => {
        fs.unlinkSync(path.join(context.projectPath, 'project.config.json'));
        const result = run(context, 'upload');
        expectStatus(result, 1);
        assert(!fs.existsSync(result.trace));
    });
    test('upload reports a missing package.json without an unhandled rejection', context => {
        fs.unlinkSync(path.join(context.cwd, 'package.json'));
        const result = run(context, 'upload');
        expectStatus(result, 1);
        assert(result.output.includes('package.json'));
        assert(!result.output.includes('triggerUncaughtException'));
    });
    for (const scenario of ['upload-error', 'git-error', 'project-error']) {
        test(`upload reports ${scenario} and exits with failure`, context => {
            const result = run(context, 'upload', { scenario });
            expectStatus(result, 1);
            assert(result.output.includes(`mock ${scenario.split('-')[0]} failure`));
            assert(!result.output.includes('triggerUncaughtException'));
        });
    }
    for (const operation of ['module', 'action']) {
        for (const scenario of ['upload-error', 'git-error']) {
            test(`${operation} propagates ${scenario} to its awaiting caller`, context => {
                const result = run(context, 'upload', { operation, scenario });
                expectStatus(result, 0);
                assert(result.output.includes('Promise rejection reached caller'));
            });
        }
    }
    test('init returns its promise and propagates prompt failures', context => {
        const result = run(context, 'init', { operation: 'init', scenario: 'init-error' });
        expectStatus(result, 0);
        assert(result.output.includes('Promise rejection reached caller'));
    });
    test('CLI handles asynchronous init failures', context => {
        const result = run(context, 'init', { scenario: 'init-error' });
        expectStatus(result, 1);
        assert(result.output.includes('mock prompt failure'));
        assert(!result.output.includes('triggerUncaughtException'));
    });
    test('init waits for and writes prompted configuration', context => {
        expectStatus(run(context, 'init'), 0);
        assert.strictEqual(JSON.parse(fs.readFileSync(context.configPath, 'utf8')).projectPath, './project');
    });
} finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
