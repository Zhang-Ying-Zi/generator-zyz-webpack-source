const autoprefixer = require("autoprefixer");

module.exports = function(BuildMode) {
  function generateBaseCssLoader(appendLoaders) {
    appendLoaders = appendLoaders || [];
    const baseCssLoaders = [];
    if (BuildMode === "development") {
      baseCssLoaders.push("style-loader");
    } else {
      baseCssLoaders.push({
        loader: "file-loader",
        options: {
          name: "[name].[contenthash:4].css"
        }
      });
      baseCssLoaders.push({
        loader: "extract-loader",
        options: {}
      });
    }
    baseCssLoaders.push({
      loader: "css-loader",
      options: {
        sourceMap: true,
        importLoaders: 1 + appendLoaders.length,
        modules: {
          localIdentName: "[name]-[local]-[hash:base64:4]"
        }
      }
    });
    baseCssLoaders.push({
      loader: "postcss-loader",
      // Necessary for external CSS imports to work
      // https://github.com/facebookincubator/create-react-app/issues/2677
      ident: "postcss",
      options: {
        postcssOptions: {
          plugins: [
            autoprefixer({
              overrideBrowserslist: [
                "> 1%",
                "last 3 versions",
                "iOS >= 7",
                "Android >= 4.1",
                "ie >= 6",
                "Firefox >= 20",
                "Chrome >= 20",
                "Safari >=2",
                "Opera >=20"
              ]
            })
          ]
        }
      }
    });
    return baseCssLoaders.concat(appendLoaders);
  }
  const cssLoader = generateBaseCssLoader();
  const lessLoader = generateBaseCssLoader([
    {
      loader: "less-loader",
      options: {
        strictMath: true
        //noIeCompat: false
      }
    }
  ]);
  const scssLoader = generateBaseCssLoader([
    {
      loader: "sass-loader",
      options: {
        sourceMap: true
      }
    }
  ]);

  const moduleConfig = {
    rules: [
      {
        test: /\.css$/,
        use: cssLoader
      },
      {
        test: /\.less$/,
        use: lessLoader
      },
      {
        test: /\.s(a|c)ss$/,
        use: scssLoader
      }
    ]
  };

  const pluginsConfig = [];
  // if (BuildMode === "production") {
  //   pluginsConfig.push(
  //     new MiniCssExtractPlugin({
  //       filename: "[name].[contenthash:4].css",
  //       chunkFilename: "[name].[contenthash:4].[id].css"
  //     })
  //   );
  // }

  return {
    module: moduleConfig,
    plugins: pluginsConfig
  };
};
