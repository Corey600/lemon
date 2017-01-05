
// const config = require('./build/eslintrc')
//
// module.exports = config.getNode()

module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },

  "env": {
    "es6": true,
    "node": true
  },

  "globals": {
    "document": false,
    "navigator": false,
    "window": false
  },

  "rules": {
    "indent": ["error", 2, {"SwitchCase": 1}],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "object-curly-spacing": ["warn", "always", {"objectsInObjects": false}],
    "no-debugger": "error",
    "no-alert": "error",
    "no-console": "warn"
  }
}
