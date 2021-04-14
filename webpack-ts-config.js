const path = require("path");

module.exports = function(BuildMode) {
  const moduleConfig = {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              configFile: path.resolve(__dirname, "babel.config.json")
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

  const pluginsConfig = [];

  return {
    module: moduleConfig,
    plugins: pluginsConfig
  };
};
