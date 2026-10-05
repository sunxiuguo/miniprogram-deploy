const assert = require('assert');
const { MiniprogramCi } = require('../../dist/modules/miniprogram-ci');
const { uploadAction, initAction } = require('../../bin/actions');

(async () => {
    const operation = process.env.TEST_OPERATION === 'module'
        ? new MiniprogramCi(process.cwd()).upload()
        : process.env.TEST_OPERATION === 'init' ? initAction() : uploadAction();
    assert(operation && typeof operation.then === 'function', 'Action must return its promise');
    await assert.rejects(operation, /mock (upload|git|prompt) failure/);
    console.log('Promise rejection reached caller');
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
