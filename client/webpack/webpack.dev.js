/* eslint-disable */

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const fs = require("fs");

const allowHttps = () => {
  const keyFilePath = "./ssl/localhost-key.pem";
  const certFilePath = "./ssl/localhost.pem";

  if (fs.existsSync(keyFilePath) && fs.existsSync(certFilePath)) {
    return {
      https: {
        key: fs.readFileSync("./ssl/localhost-key.pem"),
        cert: fs.readFileSync("./ssl/localhost.pem"),
      },
    };
  } else return {};
};

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    historyApiFallback: true,
    ...allowHttps(),
  },
  optimization: {
    runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              plugins: [require.resolve("react-refresh/babel")],
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  infrastructureLogging: {
    level: "info",
  },

  stats: "minimal",
  target: "web",
};
