const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = function(BuildMode) {
  return {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: {}
            }
          ]
        }
      ]
    },
    plugins: [new VueLoaderPlugin()]
  };
};
