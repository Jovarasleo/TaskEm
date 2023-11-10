const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const options = {
  generate: (file) => {
    return {
      ...file,
      name: "Task'Em",
      short_name: "TaskEm",
      icons: [
        {
          src: path.resolve(__dirname, "../src/mhm.png"),
          sizes: "32x32",
          type: "image/png",
        },
      ],
      display: "fullscreen",
      start_url: "./build/index.html",
      theme_color: "#B12A34",
      background_color: "#B12A34",
    };
  },
  path: "./manifest.json",
};

module.exports = {
  entry: {
    app: "./src/index.tsx",
    // serviceWorker: {
    //   import: path.resolve(__dirname, "../src/serviceWorker.ts"),
    //   filename: "serviceWorker.js",
    // },
  },
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ["file-loader"],
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
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      inject: true,
    }),
    new WebpackManifestPlugin(options),
  ],
};
