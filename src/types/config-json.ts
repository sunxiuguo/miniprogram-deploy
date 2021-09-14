import { ProjectType } from "miniprogram-ci/dist/@types/types";

export interface DEPLOY_CONFIG_DATA {
    /** 项目的类型，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin */
    type: ProjectType;
    /** 私钥路径，在获取项目属性和上传时用于鉴权使用，在 微信公众平台 上使用小程序管理员登录后下载 */
    privateKeyPath: string;
    /** 自定义发布版本号, 默认取package.json中的version字段 */
    version?: string;
    /** 自定义发布备注, 默认取最近一次git commit message */
    desc?: string;
    /** 项目的路径，即 project.config.json 所在的目录 */
    projectPath: string;
}