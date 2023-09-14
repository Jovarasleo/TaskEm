const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ["file-loader"],
      },
    ],
  },
  output: {
    filename: "index.[hash].js",
    asyncChunks: true,
    path: path.resolve(__dirname, "../build"),
    clean: true,
  },
  optimization: {
    runtimeChunk: false,
  },
  entry: {
    serviceWorker: {
      import: "./src/serviceWorker.js",
      filename: "serviceWorker.js", // Set a specific filename
    },
  },
  plugins: [new MiniCssExtractPlugin({ filename: "[fullhash].css" })],

  optimization: {
    // splitChunks: {
    //   chunks: "all",
    //   cacheGroups: {
    //     serviceWorker: {
    //       test: /service-worker.js/,
    //       name: "service-worker",
    //       chunks: "all",
    //     },
    //   },
    // },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
