// Preload only in test child processes. Never load the real WeChat SDK.
const assert = require('assert');
const fs = require('fs');
const Module = require('module');
const os = require('os');

const originalLoad = Module._load;
const scenario = process.env.TEST_SCENARIO;
os.cpus = () => Array.from({ length: Number(process.env.TEST_CPU_COUNT || 4) }, () => ({}));

Module._load = function (request, parent, isMain) {
    if (request === 'miniprogram-ci') {
        return {
            Project: class {
                constructor(options) {
                    if (scenario === 'project-error') throw new Error('mock project failure');
                    this.options = options;
                }
            },
            async upload(options) {
                // Make completion asynchronous to exercise the CLI promise boundary.
                await new Promise(resolve => setTimeout(resolve, 10));
                fs.writeFileSync(process.env.TEST_UPLOAD_TRACE, JSON.stringify({
                    version: options.version,
                    desc: options.desc,
                    threads: options.threads,
                    setting: options.setting,
                    project: options.project.options
                }));
                if (scenario === 'upload-error') throw new Error('mock upload failure');
                options.onProgressUpdate({ _msg: 'app.js', _status: 'done' });
                return { subPackageInfo: [{ name: '__APP__', size: 1024 }] };
            }
        };
    }
    if (request === 'simple-git') {
        return () => ({
            async log() {
                if (scenario === 'git-error') throw new Error('mock git failure');
                return { latest: { message: 'mock commit message' } };
            }
        });
    }
    if (request === 'inquirer') {
        return {
            async prompt() {
                if (scenario === 'init-error') throw new Error('mock prompt failure');
                return {
                    type: 'miniProgram',
                    projectPath: './project',
                    privateKeyPath: './unused-test.key'
                };
            }
        };
    }
    assert(!request.startsWith('miniprogram-ci/'), 'Tests must not load real SDK modules');
    return originalLoad.call(this, request, parent, isMain);
};
