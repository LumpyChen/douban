'use'
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './src/index.js',
  },
  output: {
    path: path.resolve('./dist/static'),
    filename: '[name].js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
};
