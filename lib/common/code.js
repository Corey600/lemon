/**
 * Created by Corey600 on 2016/5/20.
 *
 * 错误码定义
 *
 */

'use strict'

/**
 * 错误码说明
 * @type {{}}
 */
var MSG = {}

/**
 * 定义错误码说明
 * @param code
 * @param msg
 * @returns {*}
 */
function defineCode(code, msg){
  MSG[code] = msg
  return code
}

/**
 * 错误码列表
 * @type {{}}
 */
var CODE = {
  NONSUPPORT:  defineCode(   -2, '未开发' ),
  ERROR:       defineCode(   -1, '异常' ),
  SUCCESS:     defineCode(    0, '成功' ),
  AUTH_FAILED: defineCode( 1000, '认证失败' ),
  PARAM_ERROR: defineCode( 1010, '参数错误' )
}

module.exports = {
  CODE: CODE,
  MSG: MSG
}
