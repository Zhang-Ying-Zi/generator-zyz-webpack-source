const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = function(BuildMode) {
  const isDevelopment = BuildMode === "development";
  const isProduction = BuildMode === "production";

  function generateBaseCssLoader(appendLoaders) {
    appendLoaders = appendLoaders || [];
    return [
      isDevelopment && "style-loader",
      isProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: {}
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
          importLoaders: 1 + appendLoaders.length,
          modules: {
            // localIdentName: "[name]-[local]-[hash:base64:4]"
            localIdentName: "[name]-[local]"
          }
        }
      },
      {
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
      }
    ]
      .filter(Boolean)
      .concat(appendLoaders);
  }

  return {
    module: {
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
    },
    plugins: [
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash:4].css",
          chunkFilename: "[name].[contenthash:4].[id].js"
        })
    ].filter(Boolean),
    optimization: {
      minimize: true,
      minimizer: [isProduction && new CssMinimizerPlugin()].filter(Boolean)
    }
  };
};
