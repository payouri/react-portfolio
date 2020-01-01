const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
// const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
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
      components: path.resolve(__dirname, './src/components'),
      hoc: path.resolve(__dirname, './src/HOC'),
      js: path.resolve(__dirname, './src/commons/js'),
      styles: path.resolve(__dirname, './src/commons/styles')
    }
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
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    htmlWebpackPlugin,
    // new HtmlWebpackExcludeAssetsPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    })
  ]
}