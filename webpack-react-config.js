const path = require("path");

module.exports = function(BuildMode) {
  const moduleConfig = {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, "babel.config.json")
            // presets: ["@babel/preset-env"],
          }
        }
      }
    ]
  };

  const pluginsConfig = [];

  return {
    module: moduleConfig,
    plugins: pluginsConfig
  };
};
