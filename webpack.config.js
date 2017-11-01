"use strict";
const { resolve } = require("path");

let webpack = require("webpack");

module.exports = {
  context: __dirname + "/blog",
  entry: {
    app: "./_assets/js/index.js"
    // sw: './_assets/js/sw.js'
  },
  output: {
    path: resolve("./blog/_site/")
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  ],
  devtool: "source-map"
};
