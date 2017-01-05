/**
 * Created by Corey600 on 2017/1/5.
 */

'use strict'

function getConfig() {
  return {
    'parserOptions': {
      'sourceType': 'module'
    },

    'env': {
      'commonjs': true
    },

    'globals': {
      'document': false,
      'navigator': false,
      'window': false
    },

    'rules': {
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'object-curly-spacing': ['warn', 'always', { 'objectsInObjects': false }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-console': 'warn'
    }
  }
}

module.exports.getBrowser = function () {
  let config = getConfig()
  // config.parserOptions.ecmaVersion = 5
  // config.parserOptions.ecmaFeatures = {}
  // config.parserOptions.ecmaFeatures.jsx = true
  // config.env.browser = true
  // config.env.node = false
  // config.rules['no-console'] = 'warn'
  return config
}

module.exports.getNode = function () {
  let config = getConfig()
  // config.parserOptions.ecmaVersion = 6
  // config.env.browser = false
  // config.env.node = true
  // config.env.es6 = true
  // config.globals = {}
  // config.globals.document = true
  // config.globals.navigator = true
  // config.globals.window = true
  // config.rules['no-console'] = 'off'
  return config
}
