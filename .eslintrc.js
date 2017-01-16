"use strict"

module.exports = {
    "extends": "airbnb",
    "installedESLint": true,
    "env": {
      "browser": false,
      "node": true,
    },
    "rules": {
      "linebreak-style": ["error", "unix"],
      "semi": ["error", "never"],
      "strict": ["off", "global"],
    },
    "plugins": [
        "react"
    ],
};
