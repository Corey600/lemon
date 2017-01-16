/**
 * Created by Corey600 on 2016/5/16.
 *
 * 通用函数
 *
 */

'use strict'

const crypto = require('crypto')
const _ = require('lodash')
const uuid = require('node-uuid')

/**
 * 获取一个随机UUID
 * @returns {XML|*|string|void}
 * @public
 */
module.exports.UUID = () => uuid.v4().replace(/-/g, '')

/**
 * 计算MD5值
 * @param data
 * @returns {*}
 * @public
 */
module.exports.MD5 = (data) => {
  const md5 = crypto.createHash('md5')
  md5.update(data)
  return md5.digest('hex')
}

/**
 * 产生一个随机整数
 * @param s {Number}
 * @param e {Number}
 * @returns {Number}
 * @public
 */
module.exports.getRandom = (s, e) => {
  let start = s
  let end = e
  if (start > end) {
    const temp = start
    start = end
    end = temp
  }
  const rand = Math.floor(Math.random() * ((end - start) + 1))
  return (start + rand)
}

/**
 * 合并为一个URL，去除拼接处多余的 '/'
 * @param s1
 * @param s2
 * @returns {string}
 * @public
 */
module.exports.urlJoin = (s1, s2) => {
  let str1 = s1
  let str2 = s2
  if (_.isString(str1) && str1.length > 0 && str1[str1.length - 1] === '/') {
    str1 = str1.substr(0, str1.length - 1)
  }
  if (_.isString(str2) && str2.length > 0 && str2[0] === '/') {
    str2 = str2.substr(1, str2.length - 1)
  }
  return `${str1}/${str2}`
}
