/**
 * Created by Corey600 on 2017/01/22.
 */

'use stric'

const log = require('../common/log').getLogger(__filename)

const request = require('request')
const config = require('config')

const redis = require('../common/redis')
const RET = require('../common/ret')
const CODE = require('../common/code').CODE

/**
 * 执行 github api 接口请求
 * @param  {string} method 方法名，例：GET
 * @param  {string} api    接口名成
 * @param  {*} data   接口数据
 * @return {Promise}        [description]
 */
function doRequest(method, api, data) {
  const url = config.get('github.apiUrl') + api
  const option = {
    method,
    url,
    json: true,
    headers: {
      'User-Agent': 'request',
    },
  }
  if (method === 'POST') {
    option.form = data
  }
  return new Promise((resolve, reject) => {
    request(option, (error, response, body) => {
      if (error) {
        log.error('Request [url: %s] Error!', url)
        return reject(error)
      }
      if (response.statusCode !== 200) {
        log.error('GitHub API Error:', response)
        return resolve(new RET(CODE.GITHUB_ERROR, body))
      }
      return resolve(new RET(CODE.SUCCESS, body))
    })
  })
}

/**
 * 获取仓库信息
 * @param  {string}    username   用户名
 * @param  {string}    repository 仓库名
 * @return {Generator}            [description]
 */
module.exports.getRepo = function* getRepo(username, repository) {
  const accessToken = yield redis.get(`koa:accessToken:${username}`)
  return yield doRequest('GET',
    `/repos/${username}/${repository}?access_token=${accessToken}`)
}

/**
 * 按路径获取内容
 * @param  {string}    username   用户名
 * @param  {string}    repository 仓库名
 * @param  {string}    path       路径
 * @return {Generator}            [description]
 */
module.exports.getContents = function* getRepo(username, repository, path) {
  const accessToken = yield redis.get(`koa:accessToken:${username}`)
  return yield doRequest('GET',
    `/repos/${username}/${repository}/contents${path}?access_token=${accessToken}`)
}
