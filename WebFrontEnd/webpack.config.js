const webpack = require('webpack');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',//'production',
  devtool: 'false',
  target: 'electron-renderer',
  entry: {
    deptCascader: "./src/components/DeptCascader.js",
    deptUserCascader: "./src/components/DeptUserCascader.js"
  },//唯一入口文件
  output: {
    path: __dirname + "/app/js",//打包后的文件存放的地方
    filename: "[name]-bundle.js"//打包后输出文件的文件名
  },
  node: {
    fs: 'empty',
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /(\.css|\.less)$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"
          }, {
            loader: "less-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.BannerPlugin('房趣科技版权所有，翻版必究'),
    new UglifyjsWebpackPlugin()
  ]



}
