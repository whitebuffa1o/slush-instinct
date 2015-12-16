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

  resolve: {
    root: [path.join(__dirname, 'bower_components')]
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
    ]
  },

  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    ),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
  ]
}
