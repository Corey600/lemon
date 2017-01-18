
'use stric'

const log = require('../common/log').getLogger(__filename)

const request = require('request')
const config = require('config')
const redis = require('../common/redis')

const RET = require('../common/ret')
const CODE = require('../common/code').CODE

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
        log.info(response)
        return resolve(new RET(CODE.SUCCESS, body))
      }
      return resolve(new RET(CODE.SUCCESS, body))
    })
  })
}

module.exports.getRepo = function* getRepo(username, repository) {
  const accessToken = yield redis.get(`koa:accessToken:${username}`)
  return yield doRequest('GET', `/repos/${username}/${repository}?access_token=${accessToken}`)
}
