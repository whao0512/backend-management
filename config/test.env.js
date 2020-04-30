'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"test"',
  // BASE_API: '"http://47.107.111.34:8182/"',
  BASE_API: '"http://seller-service-sit.cyblogs.com"',
})
