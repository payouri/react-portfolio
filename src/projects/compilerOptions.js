const path = require('path')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../../dist/projects'),
        filename: '[name]/bundle.js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '../'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.css']
    },
    optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          // min/Size: 0,
          maxSize: 0,
          minChunks: 4,
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
          automaticNameDelimiter: '~',
          automaticNameMaxLength: 30,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            }
          }
        }
      },
    module: {
        rules: [
            {
              test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                  }
                }
              ]
            },
            {
                test: /\.css$/,
                use: [
                    { 
                        loader: "style-loader",
                        options: {
                        }
                    },
                    { 
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            sourceMap: true,
                        }
                    },
                ]
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/preset-react",
                        [
                            "@babel/preset-env",
                            {
                                "useBuiltIns": "entry"
                            }
                        ]
                    ],
                    plugins: [
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-transform-regenerator"/*,
                        "@babel/plugin-syntax-dynamic-import" */
                    ]
                },
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    }

}