module.exports = {
  extends: [
    "plugin:vue/base"
  ],
  "parserOptions": {
    "ecmaFeatures": {
        "experimentalObjectRestSpread": true,
        "jsx": false
    }
},
  rules: {
    "indent": [
      "error",
      2
    ],
    "quotes": [
      "error",
      "single"
    ],
    semi: [
        "error",
        "always"
    ]
  }
}