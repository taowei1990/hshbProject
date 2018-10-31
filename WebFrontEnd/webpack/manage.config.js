const webpack = require('webpack');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'development',//'production',
  devtool: 'false',
  target: 'electron-renderer',
  entry: {
    estate: "./src/layout/manage/estate.js"
  },//唯一入口文件
  output: {
    path: path.resolve('./dist/js') + "/manage",//__dirname + "/app/js",//打包后的文件存放的地方
    filename: "[name].js"//打包后输出文件的文件名
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
        test: /(\.less)$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /(\.css)$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"
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
    //new UglifyjsWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: './src/html/manage/estate.html',   // 指定产出的模板
      filename: '../../html/manage/eatate.html',          // 产出的文件名
      chunks: ['estate'],     // 在产出的HTML文件里引入哪些代码块
      hash: true,                     // 名称是否哈希值
      title: 'estate',                  // 可以给模板设置变量名，在html模板中调用 htmlWebpackPlugin.options.title 可以使用
      minify: {                       // 对html文件进行压缩
        removeAttributeQuotes: true, // 移除双引号
        collapseWhitespace: true  //去除空格
      }
    }),
   

  ]
}