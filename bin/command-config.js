const { initAction, doctorAction, uploadAction } = require("./actions");

const COMMAND_CONFIG = [
    {
        command: 'init',
        description: 'Init the deploy configuration file',
        action: initAction
    },
    {
        command: 'doctor',
        description: 'Check if the deploy configuration file is correct',
        action: doctorAction
    },
    {
        command: 'upload',
        description: 'Upload the miniprogram bundle',
        action: uploadAction
    },
];


module.exports = {
    COMMAND_CONFIG
}