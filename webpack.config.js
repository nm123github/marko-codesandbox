
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const outputDirectory = "./dist";

module.exports = {
  entry: "./src/client.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: "client.js"
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/, // matches style.less { ... } from our template
        loader: "style-loader!css-loader!less-loader!"
      },
      {
        test: /\.marko$/,
        loader: 'marko-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
};

