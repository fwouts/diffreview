const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  entry: path.resolve(__dirname, "src", "main.tsx"),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  target: "web",
  mode,
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  node: {
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
    module: "empty"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/
      },
      {
        oneOf: [
          {
            test: /\.module\.css$/,
            use: [
              "style-loader",
              {
                loader: "typings-for-css-modules-loader",
                options: {
                  modules: true,
                  camelCase: true,
                  namedExport: true
                }
              }
            ],
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "main.html")
    }),
    new webpack.DefinePlugin({
      NODE_ENV: mode
    })
  ]
};
