const { merge } = require("webpack-merge")
const commonConfiguration = require("./webpack.common")

const devConfig = {
    mode: "development"
};

module.exports = merge(commonConfiguration, devConfig)