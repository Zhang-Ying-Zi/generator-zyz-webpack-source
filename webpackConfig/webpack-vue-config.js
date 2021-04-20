const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = function(BuildMode) {
  const isDevelopment = BuildMode === "development";

  return {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: {},
            },
          ],
        },
      ],
    },
    plugins: [new VueLoaderPlugin()],
    resolve: {
      alias: Object.assign(
        {},
        isDevelopment
          ? {
              // 使用完整版而不是运行时版本
              vue$: "vue/dist/vue.esm.js", // 用 webpack 1 时需用 'vue/dist/vue.common.js'
            }
          : {}
      ),
    },
  };
};
