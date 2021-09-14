import { Validator } from 'jsonschema';

import schema from '../schemas/config-json-schema.json';

const v = new Validator()
// 绑定schema，这里的 `configdata` 对应 json-schema.json 的 `$id`
v.addSchema(schema, '/configdata')
 
export const validateConfigData = (data: any) => {
  // 校验配置文件
  const result = v.validate(data, {
    // DEPLOY_CONFIG_DATA 为 types/config-json.ts中 定义的interface
    $ref: `configdata#/definitions/DEPLOY_CONFIG_DATA`
  });

  return result
}