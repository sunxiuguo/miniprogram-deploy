# 微信小程序自动部署工具

本工具以配置文件+命令的方式, 基于miniprogram-ci完成微信小程序的自动化上传. 

使用前需要使用小程序管理员身份访问"微信公众平台-开发-开发设置"后下载代码上传密钥，并配置 IP 白名单，才能进行上传、预览操作。


## 一、如何使用

### **安装**

`npm install -g miniprogram-deploy`

### **配置文件**

* 自动创建：在小程序项目根目录运行命令 `miniprogram-deploy init`
* 手动创建：在小程序项目根目录新建配置文件 mp-deploy.config.json, 格式参考下方 init命令的描述.
### **上传**

在小程序项目根目录运行命令 `miniprogram-deploy upload`


## 二、命令

### **init**

`miniprogram-deploy init`

第一次运行upload之前, 需要初始化mp-deploy.config.json配置文件.

只需要初始化一次, 后续只需要单独运行 `miniprogram-deploy upload`即可完成微信小程序的上传.


```json
{
    "type": "miniProgram",
    "privateKeyPath": "./private.key",
    "version": "2.1.1",
    "desc": "版本备注",
    "projectPath": "./dist"
}
```
- type

(必填) - 项目的类型，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin

- privateKeyPath
 
(必填) - 私钥路径，在获取项目属性和上传时用于鉴权使用，需要使用小程序管理员身份访问"微信公众平台-开发-开发设置"后下载密钥

- projectPath

(必填) - 打包后项目的路径，即 打包后project.config.json 所在的目录

- version

(选填) - 自定义发布版本号, 默认取package.json中的version字段

- desc

(选填) - 自定义发布备注, 默认取最近一次git commit message


### **doctor**

`miniprogram-deploy doctor`

校验mp-deploy.config.json配置文件是否符合要求.

### **upload**

`miniprogram-deploy upload`

上传打包后的小程序包, 实时输出上传进度, 最终打印上传包的结果.

![demo](https://user-images.githubusercontent.com/32354149/134465731-8ae2bc44-9aa8-4025-be3a-619a852d8f75.gif)


## 三、选项

### **-V**

`miniprogram-deploy -V`

查看当前cli版本

### **-h**

`miniprogram-deploy -h`

查看当前cli所有的命令和选项
