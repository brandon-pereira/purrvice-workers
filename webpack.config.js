const webpack = require('webpack');

module.exports = {
	entry: ['babel-polyfill', './App/index.js'],
	mode: 'development',
	output: {
		path: '/',
		filename: 'script.js'
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: [["env", {
							"targets": {
								"browsers": ["last 2 versions"]
							}
						}]],
						plugins: [
							"add-module-exports" // export default will allow you to import without typing .default
						]
					}
				}]
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			}
		]
	},
	plugins: [
		new webpack.SourceMapDevToolPlugin()
	]
}
