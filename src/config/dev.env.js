'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {//测试环境域名
  NODE_ENV: '"development"',
  BASE_API: '"http://seller-service-sit.cyblogs.com"'
})
