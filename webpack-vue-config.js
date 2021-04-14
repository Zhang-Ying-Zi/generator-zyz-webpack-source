const { VueLoaderPlugin } = require("vue-loader");

module.exports = function(BuildMode) {
  const moduleConfig = {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  };

  const pluginsConfig = [new VueLoaderPlugin()];

  return {
    module: moduleConfig,
    plugins: pluginsConfig
  };
};
