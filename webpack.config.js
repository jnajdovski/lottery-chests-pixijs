const webpack = require('webpack');
const fs = require('fs')
const path = require('path')
const process = require('process')
const Mustache = require('mustache')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const renderHTML = (options) => {
  let htmlTemplate = fs.readFileSync(path.join(process.cwd(), './src/index.html')).toString()
  return Mustache.render(htmlTemplate, options)
}

const config = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: ({ htmlWebpackPlugin }) => renderHTML({
        title: 'pixijs-examples'
      }),
      filename: 'index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        // Now we apply rule for static files
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf|mp3|ogg|mp4)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'assets/',
        },
      },
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  }
};

module.exports = config;