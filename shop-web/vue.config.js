module.exports = {
  //关闭语法检查
  lintOnSave: false,
  //开启代理服务器
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
