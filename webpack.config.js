module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/public',
    publicPath: '/js/',
    filename: 'bundle.js'
  }
};

