const inquirer = require('inquirer');
const { MiniprogramCi } = require('../dist/modules/miniprogram-ci.js');
const { writeDeployConfigFile, checkDeployConfigFile } = require('../dist/modules/fs.js');
const currentDir = process.cwd();

function initAction() {
    const initQuestions = [
        {
            type: 'list',
            name: 'type',
            message: '请选择项目的类型',
            choices: [
                {
                    name: '微信小程序',
                    value: 'miniProgram'
                },
                {
                    name: '微信小程序插件',
                    value: 'miniProgramPlugin'
                },
                {
                    name: '微信小游戏',
                    value: 'miniGame'
                },
                {
                    name: '微信小游戏插件',
                    value: 'miniGamePlugin'
                },
            ]
        },
        {
            type: 'input',
            name: 'privateKeyPath',
            message: '请输入私钥路径，在获取项目属性和上传时用于鉴权使用，在 微信公众平台 上使用小程序管理员登录后下载',
        },
        {
            type: 'input',
            name: 'projectPath',
            message: '请输入项目的路径，即 project.config.json 所在的目录',
        },
        {
            type: 'input',
            name: 'version',
            message: '请输入自定义发布版本号, 默认取package.json中的version字段',
            default: ''
        },
        {
            type: 'input',
            name: 'desc',
            message: '请输入自定义发布备注, 默认取最近一次git commit message',
            default: ''
        },
    ];

    inquirer.prompt(initQuestions).then(result => {
        writeDeployConfigFile(result, currentDir);
    })
}

function doctorAction() {
    checkDeployConfigFile(currentDir);
}

function uploadAction() {
    new MiniprogramCi(currentDir).upload();
}

module.exports = {
    initAction,
    doctorAction,
    uploadAction
}