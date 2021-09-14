import { MiniProgramCI } from "miniprogram-ci/dist/@types/types";

export interface ProjectConfig {
    appid: string;
    setting: MiniProgramCI.ICompileSettings;
}