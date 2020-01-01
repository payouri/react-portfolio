const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../../dist'),
        filename: '[name]/bundle.js',
        publicPath: './'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.css']
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