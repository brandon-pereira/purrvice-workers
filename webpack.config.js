module.exports = {
  entry: {
		'script': './scripts/script.js'
	},
  output: {
    path: './',
		filename: '[name].js'
  },
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.scss$/,
				loader: 'style!css!sass'
			}
		]
	}
};