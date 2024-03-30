const nodeExternals = require("webpack-node-externals");
const path          = require("path");

module.exports =
{
	entry        : path.resolve(__dirname, "./src/index.ts"),
	output       :
	{
		path         : path.resolve(__dirname, "./dist"),
		filename     : "index.js",
		libraryTarget: 'umd',
	},
	mode         : "production",
	target       : "node",
	// Enable sourcemaps for debugging webpack's output.
	devtool      : false,//"source-map",
	resolve      :
	{
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".jsx"],
	},
	externals    : [nodeExternals()],
	plugins      : [],
	module       :
	{
		rules:
		[
			{
				test   : /(\.ts(x?))|(\.jsx?)$/,
				exclude: /node_modules/,
				use    :
				[
					{ loader: "ts-loader" },
				],
			},
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: "pre",
				test   : /\.js$/,
				exclude: /node_modules/,
				loader : "source-map-loader",
			},
			{
				test   : /\.scss$/,
				exclude: /node_modules/,
				use    :
				[
					// Use the chain sass-loader -> css-loader -> style-loader
					// But use MiniCssExtractPlugin on prod, so we get a file.
					{ loader: "style-loader" },
					{ loader: "css-loader"   },
					{ loader: "sass-loader"  },
				],
			}
		],
	},
};
