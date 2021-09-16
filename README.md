# 微信小程序自动部署工具

本工具以配置文件+命令的方式, 完成微信小程序的自动化上传. 

## 1. 如何使用

### **1.1 安装**

`npm install -g mp-deploy-cli`

### **1.2 配置文件**

* 自动创建：在小程序项目根目录运行命令 `mp-deploy-cli init`
* 手动创建：在小程序项目根目录新建配置文件 mp-deploy.config.json, 格式参考下方 init命令的描述.
### **1.3 上传**

在小程序项目根目录运行命令 `mp-deploy-cli upload`


## 2. 命令

### **2.1 init**

`mp-deploy-cli init`

第一次运行upload之前, 需要初始化mp-deploy.config.json配置文件.

只需要初始化一次, 后续只需要单独运行 `mp-deploy-cli upload`即可完成微信小程序的上传.


```json
{
    "type": "miniProgram",
    "privateKeyPath": "./private.key",
    "version": "2.1.1",
    "desc": "版本备注",
    "projectPath": "./dist"
}
```
**type**

(必填) - 项目的类型，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin

**privateKeyPath**
 
(必填) - 私钥路径，在获取项目属性和上传时用于鉴权使用，在 微信公众平台 上使用小程序管理员登录后下载

**projectPath**

(必填) - 打包后项目的路径，即 打包后project.config.json 所在的目录

**version**

(选填) - 自定义发布版本号, 默认取package.json中的version字段

**desc**

(选填) - 自定义发布备注, 默认取最近一次git commit message


### **2.2 doctor**

`mp-deploy-cli doctor`

校验mp-deploy.config.json配置文件是否符合要求.

### **2.3 upload**

`mp-deploy-cli upload`

上传打包后的小程序包, 实时输出上传进度, 最终打印上传包的结果.