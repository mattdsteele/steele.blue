'use strict';

let webpack = require('webpack');

module.exports = {
  context: __dirname + '/blog',
  entry: './_assets/js/index.js',
  output: {
    path: './blog/_site/js',
    filename: 'app.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  ],
  devtool: 'source-map'
};
