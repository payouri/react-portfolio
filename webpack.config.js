const webpack = require('webpack')
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  // excludeAssets: [/\.json$/]
});

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@constants': path.resolve(__dirname, './constants.js'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@cmp': path.resolve(__dirname, './src/components'),
      '@hoc': path.resolve(__dirname, './src/HOC'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@projects': path.resolve(__dirname, './src/projects'),
      '@pages': path.resolve(__dirname, './src/pages')
    }
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name]-[id].js'
  },
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(jp(e)?g)|(png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'imgs/'
            }
          }
        ]
      },
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css/,
        use: [
          // {
            // loader: MiniCssExtractPlugin.loader,
            // options: {
            //   // you can specify a publicPath here
            //   // by default it uses publicPath in webpackOptions.output
            //   publicPath: '/dist',
            //   hmr: process.env.NODE_ENV === 'development',
            // },
          // },
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64]',
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader'
          },
          // {
          //     loader: 'sass-loader',
          // },
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 0,
      // min/Size: 0,
      maxSize: 0,
      minChunks: 4,
      maxAsyncRequests: 10,
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
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      if(process.stdout.clearLine)
        process.stdout.clearLine()
      if(process.stdout.write) {
        const modules = args[0] && args[0].indexOf('modules') > -1 ? args[0] : ''
        process.stdout.write(` ${modules} stage:${message}, progress: ${Math.round(percentage * 100)}%\r`)
      }
    }),
    htmlWebpackPlugin,
    // new HtmlWebpackExcludeAssetsPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new webpack.DefinePlugin({
      __ROUTER_BASENAME__: JSON.stringify(process.env.NODE_ENV === 'prod' ? '/' : "/dist"),
    }),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: ['*/**', '!dist/projects', '!dist/projects/**'],
    //   verbose: true,
    // })
  ]
}