var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    site: './_src/scripts/site.js',
  },

  output: {
    filename: '[name].js',
  },
<% if(jquery){ %>
  externals: {
    'jquery': 'jQuery'
  },<% } %>

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common'),
  ]
}
