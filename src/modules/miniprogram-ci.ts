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
        const { version, desc } = this.deployOptions;

        const os = require('os');
        const packageJson = require(`${this.rootPath}/package.json`);
        const info = await getLatestCommitMsg(this.rootPath);
            
        try {
            const uploadResult = await upload({
                project: this.project,
                version: version || packageJson.version,
                desc: desc || info,
                setting: this.projectConfig?.setting || {},
                onProgressUpdate: console.log,
                // @ts-ignore
                threads: os.cpus.length
            });
        
            ConsoleOutput.ok(`upload success, ${JSON.stringify(uploadResult)}`);
        } catch (error: any) {
            ConsoleOutput.error(error.message);
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