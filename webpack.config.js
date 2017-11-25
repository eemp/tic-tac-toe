const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'js'),
    publicPath: '/js/',
    filename: 'bundle.js'
  }
};

