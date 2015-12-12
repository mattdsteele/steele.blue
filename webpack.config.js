'use strict';

let webpack = require('webpack');

module.exports = {
  context: __dirname + '/blog',
  entry: './_assets/js/index.js',
  output: {
    path: './blog/_site/js',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({})
  ],
  devtool: 'source-map'
};
