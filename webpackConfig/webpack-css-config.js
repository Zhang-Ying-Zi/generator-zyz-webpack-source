const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = function(BuildMode) {
  const isDevelopment = BuildMode === "development";
  const isProduction = BuildMode === "production";

  function generateBaseCssLoader(appendLoaders, isVendor) {
    appendLoaders = appendLoaders || [];
    return [
      isDevelopment && "style-loader",
      isProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: {},
      },
      // 第三方css库不使用module模式
      isVendor && {
        loader: "css-loader",
        options: {
          sourceMap: false,
          importLoaders: appendLoaders.length,
        },
      },
      // 第三方css库不使用module模式
      !isVendor && {
        loader: "css-loader",
        options: {
          sourceMap: true,
          importLoaders: 1 + appendLoaders.length,
          modules: {
            localIdentName: "[name]_[local]_[hash:base64:4]",
          },
        },
      },
      !isVendor && {
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
                  "Opera >=20",
                ],
              }),
            ],
          },
        },
      },
    ]
      .filter(Boolean)
      .concat(appendLoaders);
  }

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: /node_modules/,
          use: generateBaseCssLoader([], true),
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: generateBaseCssLoader(),
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: generateBaseCssLoader([
            {
              loader: "less-loader",
              options: {
                sourceMap: true,
              },
            },
          ]),
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /node_modules/,
          use: generateBaseCssLoader([
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ]),
        },
      ],
    },
    plugins: [
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash:4].css",
          chunkFilename: "[name].[contenthash:4].[id].js",
        }),
    ].filter(Boolean),
    optimization: {
      minimize: true,
      minimizer: [isProduction && new CssMinimizerPlugin()].filter(Boolean),
    },
  };
};
