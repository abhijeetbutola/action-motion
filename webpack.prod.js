const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

process.env["NODE_ENV"] = "production";

module.exports = merge([
  common,
  {
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [new CssMinimizerPlugin()],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      publicPath: "/", // important for React Router
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        inject: "body",
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "public/_redirects", to: "" },
          { from: "public/manifest.json", to: "" },
          { from: "public/favicon.ico", to: "" },
          { from: "public/icons", to: "icons" }, // optional
          { from: "public/logo192.png", to: "" },
          { from: "public/logo512.png", to: "" }, // If you’re using this in manifest
        ],
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css", // or '[name].[contenthash].css' for versioning
      }),
    ],
  },
]);
