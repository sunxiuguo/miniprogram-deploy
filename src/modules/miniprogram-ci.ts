import { Spinner } from './spinner';
import { preview, Project, upload } from 'miniprogram-ci';
import { DEPLOY_CONFIG_DATA } from '../types/config-json';
import { ProjectConfig } from '../types/project-config';
import { ConsoleOutput } from './console';
import { checkDeployConfigFile, getProjectConfig, writeDeployConfigFile } from './fs';
import { getLatestCommitMsg } from './git';

export class MiniprogramCi {
    private deployOptions: DEPLOY_CONFIG_DATA | null = null;
    private project: Project | null = null;
    private projectConfig: ProjectConfig | null = null;
    private uploadSpinner: Spinner | null  = null;
    
    constructor(private rootPath: string) {
        this.deployOptions = checkDeployConfigFile(this.rootPath);
        this.initProject();
    }

    private initProject() {
        // TODO 校验this.deployOptions的逻辑提取成公共的, 无论是装饰器还是方法
        if (!this.deployOptions) {
            // TODO 
            return;
        }
        this.projectConfig = getProjectConfig(this.deployOptions.projectPath);

        if (!this.projectConfig) {
            ConsoleOutput.error(`can't access project.config.json, please check it`);
            return;
        }

        const { type, privateKeyPath, projectPath } = this.deployOptions;

        this.project = new Project({
            appid: this.projectConfig.appid,
            type,
            projectPath,
            privateKeyPath,
            ignores: ['node_modules/**/*'],
          });
    }

    async upload() {
        if (!this.deployOptions) {
            return;
        }

        if (!this.project) {
            // TODO 检查是否存在this.project
            return;
        }
        this.uploadSpinner = new Spinner('Ready to upload...');

        const { version, desc } = this.deployOptions;

        const os = require('os');
        const packageJson = require(`${this.rootPath}/package.json`);
        const info = await getLatestCommitMsg(this.rootPath);

        this.uploadSpinner.setText('get latest commit messsage succeed');
            
        try {
            const uploadResult = await upload({
                project: this.project,
                version: version || packageJson.version,
                desc: desc || info,
                setting: {
                    ...this.projectConfig?.setting,
                    "minifyWXSS": true
                },
                onProgressUpdate: (taskStatus: any) => {
                    const msg = taskStatus._msg;
                    if (msg) {
                        this.uploadSpinner!.setText(msg, taskStatus._status === 'done');
                    }
                },
                threads: os.cpus.length
            });
            
            this.uploadSpinner.succeed('upload completed');
            // ConsoleOutput.ok(`upload success, ${JSON.stringify(uploadResult)}`);
        } catch (error: any) {
            this.uploadSpinner.fail(error.message);
            // ConsoleOutput.error(error.message);
        } finally {
            process.exit(1);
        }
    }

    async preview() {
        if (!this.deployOptions) {
            return;
        }
    }
}