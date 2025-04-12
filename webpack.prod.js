const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");

process.env["NODE_ENV"] = "production";

module.exports = merge([
  common,
  {
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        // `...`,
        new CssMinimizerPlugin(),
      ],
    },
    output: {
      // Define output directory as 'dist' (or 'build')
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js", // Filename with content hash for caching
      publicPath: "/", // Ensure assets are referenced correctly
    },
  },
]);
