# 微信小程序自动部署工具

本工具以配置文件+命令的方式, 基于miniprogram-ci完成微信小程序的自动化上传. 

使用前需要使用小程序管理员身份访问"微信公众平台-开发-开发设置"后下载代码上传密钥，并配置 IP 白名单，才能进行上传、预览操作。


## 一、如何使用

### **安装 / Installation**

**版本提示：npm 上的 `0.1.2` 不包含本文所述的退出状态和异步错误处理修复。截至 2026-10-05，这些修复已合入 GitHub，但尚未发布到 npm。需要这些修复时，请使用下方经过测试的固定提交源码构建步骤。**

**Version note: npm `0.1.2` does not include the exit-status and asynchronous error-handling fixes described here. As of 2026-10-05, those fixes are merged on GitHub but have not been released to npm. To use them, build the tested, pinned source commit below.**

#### 使用修复后的源码 / Build the source with fixes

以下示例适用于 POSIX shell。Node.js 22 和 24 已通过包装层测试；真实微信服务兼容性仍需在自己的授权环境中验证。

The example uses a POSIX shell. The wrapper tests pass on Node.js 22 and 24; real WeChat service compatibility still needs verification in your own authorized environment.

```sh
git clone https://github.com/sunxiuguo/miniprogram-deploy.git miniprogram-deploy-source
cd miniprogram-deploy-source
git checkout --detach a8608cc30c8648432aa3931b70816774acc2518c
npm ci
npm test
MINIPROGRAM_DEPLOY_CLI="$(pwd)/bin/index.js"
```

`npm test` 会构建 `dist` 并运行隔离测试，不进行真实上传。在同一个 shell 中切换到自己的小程序项目根目录，将下面的占位路径替换为实际路径；准备好下文说明的 `mp-deploy.config.json` 后运行检查。

`npm test` builds `dist` and runs isolated tests without a real upload. In the same shell, switch to your mini-program project root, replacing the placeholder path below. Prepare `mp-deploy.config.json` as described below before running the check.

```sh
cd /absolute/path/to/your-mini-program-project
node "$MINIPROGRAM_DEPLOY_CLI" doctor
```

需要交互创建配置时，可先运行 `node "$MINIPROGRAM_DEPLOY_CLI" init`。确认构建产物、上传密钥和 IP 白名单就绪后，才运行以下真实上传命令：

To create the configuration interactively, first run `node "$MINIPROGRAM_DEPLOY_CLI" init`. Run the following real upload command only after your build output, upload key, and IP allowlist are ready:

```sh
node "$MINIPROGRAM_DEPLOY_CLI" upload
```

源码用法下，本文其余示例中的 `miniprogram-deploy` 均替换为 `node "$MINIPROGRAM_DEPLOY_CLI"`。项目相对路径仍以当前小程序项目目录为准。仓库不包含生成的 `dist`，也没有 `prepare` 脚本，因此直接通过 npm 安装 GitHub 地址不能替代上述构建步骤。

For this source-based setup, replace `miniprogram-deploy` in the remaining examples with `node "$MINIPROGRAM_DEPLOY_CLI"`. Relative project paths still use the current mini-program project directory. The repository does not track generated `dist` files and has no `prepare` script, so installing the GitHub URL through npm is not a substitute for these build steps.

#### npm 已发布版本 / Published npm version

若使用 npm 的历史版本，下面命令安装的是**不包含上述修复**的 `0.1.2`：

For the published npm version, the command below installs `0.1.2`, **without the fixes above**:

```sh
npm install -g miniprogram-deploy@0.1.2
```

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

## 四、CI 与故障排查 / CI and troubleshooting

### 退出状态 / Exit status

- `doctor`：配置文件存在、JSON 可解析且通过 schema 校验时退出码为 `0`，否则为 `1`。它不会验证密钥、IP 白名单或微信接口是否可用。
- `upload`：上传成功并输出包信息后正常结束；配置、项目初始化、版本/备注读取或 SDK 上传失败时退出码为 `1`。CI 可以直接依据命令的退出状态判断成功或失败，无需忽略错误。

- `doctor` exits with `0` for a readable, parseable, schema-valid configuration, or `1` otherwise. It does not verify credentials, IP allowlists, or connectivity to WeChat.
- `upload` finishes normally after a successful upload and package report. Configuration, project initialization, version/description lookup, and SDK upload failures exit with `1`. CI should check the command's exit status rather than suppressing failures.

### 常见问题 / Common problems

1. 配置检查失败：在项目根目录运行 `miniprogram-deploy doctor`，按输出修复 `mp-deploy.config.json`；还未创建配置时先运行 `miniprogram-deploy init`。
   Configuration validation fails: run `miniprogram-deploy doctor` from your project root and fix the reported fields in `mp-deploy.config.json`. Run `miniprogram-deploy init` first if the file does not exist.
2. 找不到项目配置：确认 `projectPath` 指向构建产物中 `project.config.json` 所在目录，并在上传前完成小程序构建。相对路径按命令的当前工作目录解析。
   Project configuration is missing: build the mini program first and point `projectPath` to the directory containing the generated `project.config.json`. Relative paths are resolved from the command's working directory.
3. 版本或备注读取失败：当前实现上传前会读取根目录的 `package.json` 和最近的 Git 提交，即使配置了自定义版本或备注，也需要可读取的 `package.json` 和可用的 Git 仓库。
   Version or description lookup fails: the current implementation reads the root `package.json` and latest Git commit before uploading, including when custom values are configured. Keep both the package file and Git repository available.
4. SDK 报告鉴权错误：检查管理员配置的代码上传密钥和 IP 白名单。不要将私钥、访问令牌或完整敏感日志提交到仓库或 issue。
   The SDK reports an authentication error: check the administrator-configured upload key and IP allowlist. Never commit private keys or access tokens, or paste sensitive logs into issues.

### 本地测试 / Local tests

```sh
npm ci
npm test
```

`npm test` 会重新生成 JSON schema、编译 TypeScript，然后在独立子进程中测试 CLI 的成功/失败退出状态、错误传播、CPU 线程数和输出。测试替换了微信 SDK、Git 和交互输入，不读取真实密钥、不进行真实上传。GitHub Actions 在 Node.js 22 和 24 上运行同一套测试。

`npm test` regenerates the JSON schema, compiles TypeScript, and tests CLI success/failure exit statuses, error propagation, CPU thread counts, and output in isolated child processes. Tests replace the WeChat SDK, Git, and interactive input; they do not read real credentials or perform real uploads. GitHub Actions runs the same checks on Node.js 22 and 24.

这些测试只验证 CLI 包装层，不代表微信服务或历史 SDK 依赖在所有 Node.js 版本上的端到端兼容性。

These tests validate the CLI wrapper, not end-to-end compatibility with WeChat services or the legacy SDK dependency tree on every Node.js version.
