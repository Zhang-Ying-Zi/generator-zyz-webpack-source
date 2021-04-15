const path = require("path");

module.exports = function(BuildMode) {
  return {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              configFile: path.resolve(__dirname, "../babel.config.json")
              // presets: ["@babel/preset-env"],
            }
          }
        }
      ]
    },
    plugins: []
  };
};
