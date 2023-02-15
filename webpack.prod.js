const { merge } = require("webpack-merge")
const commonConfiguration = require("./webpack.common")

const prodConfig = {
    mode: "production",
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                'corejs': '3',
                'useBuiltIns': 'usage'
              }]
            ],
            plugins: [
              '@babel/plugin-transform-runtime']
          }
        }
      }]
    }
};

module.exports = merge(commonConfiguration, prodConfig)