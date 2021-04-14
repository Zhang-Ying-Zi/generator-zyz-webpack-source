const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const appFrameworkName = process.env.APP_NAME ? process.env.APP_NAME : "pure";
const appLibraryName = process.env.LIBRARY_NAME ? process.env.LIBRARY_NAME : "";

const buildMode =
  process.env.NODE_ENV == "development" ? "development" : "production"; // development || production || none
const devTool = buildMode == "production" ? "none" : "source-map"; // inline-source-map || source-map

const entryPathLibs = path.resolve(__dirname, "src", "libs");
let entryPathBase = path.resolve(__dirname, "src", appFrameworkName);
let outputPathBase = path.resolve(__dirname, "dist", appFrameworkName);

if (appLibraryName) {
  entryPathBase = path.resolve(entryPathBase, appLibraryName);
  outputPathBase = path.resolve(outputPathBase, appLibraryName);
}

// ** plugins **
const plugins = [
  new CleanWebpackPlugin(),
  new BundleAnalyzerPlugin({
    analyzerMode: "static"
  })
];

// ** optimization **
const optimizationMinimizer = [];
if (buildMode == "production") {
  optimizationMinimizer.push(
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false
    })
  );
}

const optimization = {
  minimizer: optimizationMinimizer
};

const rules = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "babel-loader",
        options: {
          configFile: path.resolve(__dirname, "babel.config.js")
        }
      },
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          experimentalWatchApi: true
        }
      }
    ]
  },
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    include: [entryPathBase, entryPathLibs],
    use: {
      loader: "babel-loader",
      options: {
        configFile: path.resolve(__dirname, "babel.library.config.js")
      }
    }
  }
];

const webpackConfig = {
  mode: buildMode,
  devtool: devTool,
  entry: path.join(entryPathBase, "index.js"),
  output: {
    filename: "[name].[hash:8].js",
    chunkFilename: "[name].[chunkhash:4].js",
    path: outputPathBase,
    publicPath: ""
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      // "react-dom": "@hot-loader/react-dom",
    }
  },
  optimization: optimization,
  plugins: plugins,
  module: {
    rules: rules
  }
};

if (appLibraryName) {
  webpackConfig.output.filename = appLibraryName + ".js";
  webpackConfig.output.library = appLibraryName;
  webpackConfig.output.libraryTarget = "umd"; // umd window this  变量
  // targetExport: 'default'

  webpackConfig.externals = {
    // 匹配以 "library/" 开始的所有依赖
    ///^library\/.+$/,
    //   d3: {
    //     commonjs: "d3",
    //     commonjs2: "d3",
    //     amd: "d3",
    //     root: "d3"
    //   }
  };
}

module.exports = webpackConfig;
