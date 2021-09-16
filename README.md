# 微信小程序自动部署工具

- [ ] 所有参数都由配置文件来代替, 支持不同环境的配置文件, 通过环境变量来控制读取的配置文件
  - [ ] 使用dotenv?
  - [ ] dotenv-cli?
- [x] 支持npm doctor, 校验配置文件的数据是否正确, 通过json-schema来做运行时检测
  - [x]  通过typescript-json-schema 将ts类型声明转为json-schema
  - [x]  通过 jsonschema 来进行json-schema校验
- [ ] 执行npm publish的时候, 更新json-schema
- [x] 读取项目内 project.config.json 的文件内容
- [x] ora打印上传进度
- [ ] 上传结果的展示
- [ ] 添加cwd配置, 类似于pm2, 或者加一个rootDir配置
- [ ] mp-deploy.config.json 使用jsonschema来校验? 如何使用本地schema文件校验? 或者说如何传到网络上? http://www.ayqy.net/blog/vscode-json-validation/