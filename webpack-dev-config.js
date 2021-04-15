const CONSTANT = require("./CONSTANT.js");

if (module.hot) module.hot.accept();

module.exports = function(OutputPathBase) {
  return {
    devServer: {
      // proxy: {
      //   "/api": "http://localhost:3000"
      // },
      contentBase: OutputPathBase,
      hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
      host: CONSTANT.clientHost,
      port: CONSTANT.clientPort,
      compress: true, // enable gzip compression
      historyApiFallback: true, // true for index.html upon 404, object for multiple paths
      noInfo: false, // only errors & warns on hot reload
      https: false, // true for self-signed, object for cert authority
      open: true
    }
  };
};
