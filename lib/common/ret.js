/**
 * Created by Corey600 on 2016/5/20.
 *
 * 通用返回结果对象
 *
 */

'use strict'

const _ = require('lodash')
const MSG = require('./code').MSG

class RET {
  /**
   * 通用返回结果对象
   * @param code 错误码
   * @param data 数据
   */
  constructor(code, data) {
    this.code = code
    // noinspection JSUnusedGlobalSymbols
    this.msg = MSG[code]
    if (!_.isNil(data)) {
      // noinspection JSUnusedGlobalSymbols
      this.data = data
    }
  }
}

module.exports = RET
