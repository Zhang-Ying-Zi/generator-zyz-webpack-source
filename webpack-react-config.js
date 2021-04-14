const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = function(BuildMode) {
  const isDevelopment = BuildMode === "development";

  const moduleConfig = {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              configFile: path.resolve(__dirname, "babel.config.json"),
              plugins: [
                isDevelopment && require.resolve("react-refresh/babel")
              ].filter(Boolean)
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
      }
    ]
  };

  const pluginsConfig = [
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean);

  return {
    module: moduleConfig,
    plugins: pluginsConfig
  };
};
