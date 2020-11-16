const webpack = require('webpack')
const merge = require('webpack-merge');
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    open: true,
    contentBase: './',
    proxy: {
      '/api': {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: 'https://api.github.com',
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          '^/api': ''
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        changeOrigin: true
      }
    }
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
