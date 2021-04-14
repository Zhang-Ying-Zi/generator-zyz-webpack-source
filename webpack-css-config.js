const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = function(BuildMode) {
  function generateBaseCssLoader(appendLoaders) {
    appendLoaders = appendLoaders || [];
    const baseCssLoaders = [];
    if (BuildMode === "development") {
      baseCssLoaders.push("style-loader");
    }
    if (BuildMode === "production") {
      baseCssLoaders.push({
        loader: MiniCssExtractPlugin.loader,
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

  const moduleConfig = {
    rules: [
      {
        test: /\.css$/,
        use: generateBaseCssLoader()
      },
      {
        test: /\.less$/,
        use: generateBaseCssLoader([
          {
            loader: "less-loader",
            options: {
              sourceMap: true
            }
          }
        ])
      },
      {
        test: /\.s(a|c)ss$/,
        use: generateBaseCssLoader([
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ])
      }
    ]
  };

  const pluginsConfig = [];
  if (BuildMode === "production") {
    pluginsConfig.push(
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:4].css",
        chunkFilename: "[name].[contenthash:4].[id].js"
      })
    );
  }

  const minimizer = [];
  if (BuildMode === "production") {
    minimizer.push(new CssMinimizerPlugin());
  }

  return {
    module: moduleConfig,
    plugins: pluginsConfig,
    optimization: {
      minimize: true,
      minimizer: minimizer
    }
  };
};
