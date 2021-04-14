const path = require("path");

module.exports = function(BuildMode) {
  const moduleConfig = {
    rules: [
      {
        test: /\.\/pages\/\.*.html$/,
        use: [
          "babel-loader",
          {
            loader: "framework7-component-loader",
            options: {
              //   // path to file that exports array of Template7 helpers names
              //   helpersPath: "./src/template7-helpers-list.js",
              //   // path where to look for Template7 partials
              //   partialsPath: "./src/pages/",
              //   // Template7 partials file extension
              //   partialsExt: ".f7p.html",
              //   // When enabled it will minify templates HTML content
              //   minifyTemplate: true,
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
