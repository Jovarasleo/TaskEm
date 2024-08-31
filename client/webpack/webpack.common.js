const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const options = {
  generate: (file) => {
    return {
      ...file,
      name: "Task'Em",
      short_name: "TaskEm",
      description: "Task management app",
      scope: "./",
      icons: [
        {
          src: "assets/icon-32.png",
          sizes: "32x32",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "assets/icon-64.png",
          sizes: "64x64",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "assets/icon-128.png",
          sizes: "128x128",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "assets/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      display: "standalone",
      start_url: "/",
      theme_color: "#B12A34",
      background_color: "#B12A34",
    };
  },
  path: "./manifest.json",
};

module.exports = {
  entry: {
    app: "./src/index.tsx",
    sw: "./src/service-worker.ts",
  },
  output: {
    assetModuleFilename: "[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.m?js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /manifest\.json$/, // Match the manifest.json file
        use: [
          {
            loader: "file-loader",
            options: {
              name: "manifest.json", // Output file name
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },

  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/assets/images", to: "assets" }],
    }),
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      inject: true,
    }),
    new WebpackManifestPlugin(options),
  ],
};
