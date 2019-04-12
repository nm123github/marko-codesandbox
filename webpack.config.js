const path = require("path");
const webpack = require("webpack");
const MarkoPlugin = require("@marko/webpack/plugin").default;
const CSSExtractPlugin = require("mini-css-extract-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");
const SpawnServerPlugin = require("spawn-server-webpack-plugin");

const { NODE_ENV } = process.env;
const mode = NODE_ENV ? "production" : "development";
const spawnedServer = new SpawnServerPlugin();
const markoPlugin = new MarkoPlugin();

const baseConfig = {
  mode,
  devtool: "source-map",
  output: {
    publicPath: "/static/"
  },
  resolve: {
    extensions: [".js", ".json", ".marko"]
  },
  module: {
    rules: [
      {
        test: /\.marko$/,
        loader: "@marko/webpack/loader"
      },
      {
        test: /\.(less|css)$/,
        use: [CSSExtractPlugin.loader, "css-loader", "less-loader"]
      },
      {
        test: /\.svg/,
        loader: "svg-url-loader"
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: "file-loader"
      }
    ]
  }
};

const serverConfig = {
  ...baseConfig,
  name: "Server",
  target: "async-node",
  entry: "./src/index.js",
  externals: [/^(?!marko)[^./!]/],
  optimization: {
    minimize: false
  },
  output: {
    ...baseConfig.output,
    filename: "main.js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "dist/server"),
    devtoolModuleFilenameTemplate: info =>
      path.relative(serverConfig.output.path, info.absoluteResourcePath)
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.browser": undefined,
      "process.env.BUNDLE": true
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true
    }),
    new CSSExtractPlugin({
      filename: "[name].[contenthash:8].css"
    }),
    new IgnoreEmitPlugin(/\.(css|jpg|jpeg|gif|png)$/),
    markoPlugin.server
  ]
};

const browserConfig = {
  ...baseConfig,
  name: "Browser",
  target: "web",
  output: {
    ...baseConfig.output,
    filename: "[name].[contenthash:8].js",
    path: path.join(__dirname, "dist/client")
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.browser": true
    }),
    new CSSExtractPlugin({
      filename: "[name].[contenthash:8].css"
    }),
    markoPlugin.browser
  ],
  devServer: {
    inline: false,
    stats: "minimal",
    publicPath: '/',
    //...spawnedServer.devServerConfig
    proxy: {
      '**': {
        target: true,
        router: function () {
          return 'http://127.0.0.1:' + this.address.port
        }.bind(this)
      }
    },
    before: function (app) {
      process.env.PORT = 0
      app.use(function (req, res, next) {
        if (this.listening) next()
        else this.once('listening', next)
      }.bind(this))
    }.bind(this)
  }
};

if (mode === "production") {
  const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
  const CleanPlugin = require("clean-webpack-plugin");

  browserConfig.plugins.push(new OptimizeCssAssetsPlugin(), new CleanPlugin());
  browserConfig.optimization = {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 3
    }
  };

  serverConfig.plugins.push(new CleanPlugin());
} else {
  serverConfig.plugins.push(spawnedServer);
}

module.exports = [browserConfig, serverConfig];
