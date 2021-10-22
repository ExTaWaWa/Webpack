const path = require('path');
const webpack = require('webpack');
//教學是教 extract-text-webpack-plugin 但是官方建議換下面這個，比較新
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  resolve
} = require('path');

//執行 npm run start 的時候會顯示輸出目標路徑
// console.log("=>",path.resolve(__dirname, 'dist'));
// console.log("=>",process.env.NODE_ENV);

module.exports = {
  //指定環境變數
  mode: process.env.NODE_ENV,
  //指定路徑
  context: path.resolve(__dirname, 'src'),
  //輸入位置
  entry: {
    index: './js/index.js',
    about: './js/about.js',
    test: './js/test.js',
  },
  //輸出位置
  output: {
    //這個做法是為了避免在linux上路徑會跑掉， 'dist'的部分可以改成要的名字
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].js',
  },
  devServer: {
    compress: true,
    port: 3000,
    proxy: {
      '/VsWeb/api/': {
        target: 'https://www.vscinemas.com.tw',
        changeOrigin: true,
      }
    },
  },
  //下面這個可以幫助 live reload 開啟
  target: "web",

  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, '../img'),
  //   }
  // },

  //壓縮 node 夾裡的東西塞進 vendor.js
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      //css路徑這邊改
      filename: './css/[name].css'
    }),
    //搬家用外掛（原封不動的搬）
    new CopyWebpackPlugin({
      patterns: [{
        from: 'assets',
        to: 'assets'
      }]
    }),
    //下全域可用的指令設定
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    //模板要注入的資料與 js
    new HtmlWebpackPlugin({
      title: 'Webpack前端自動化開發',
      filename: 'index.html',
      template: 'template/template.html',
      viewport: 'width=640, user-scalable=no',
      description: 'Webpack前端自動化開發，讓你熟悉現代前端工程師開發的方法',
      Keywords: 'Webpack前端自動化開發、前端、工程師、線上教學、教學範例',
      chunks: ['vendor', 'index'],
    }),
    new HtmlWebpackPlugin({
      title: '關於我們',
      filename: 'about.html',
      template: 'template/about.html',
      viewport: 'width=640, user-scalable=no',
      about: 'about',
      chunks: ['vendor', 'about'],
    }),
    new HtmlWebpackPlugin({
      filename: 'test.html',
      template: 'template/test.ejs',
      chunks: ['vendor', 'test'],
    }),
  ],
  module: {
    rules: [
      // {
      //   test: /\.(png|jpe?g|gif|html)$/i,
      //   use: [{
      //     loader: 'file-loader',
      //     options: {
      //       //路徑 檔名 副檔名
      //       name: '[path][name].[ext]'
      //     }
      //   }, ],
      // },
      //test 頁面要放的資料自動嵌入
      {
        test: /\.ejs$/,
        use: [{
          loader: "ejs-webpack-loader",
          options: {
            data: {
              title: "New Title",
              someVar: "hello world"
            },
            htmlmin: true
          }
        }]
      },
      // {
      //   test: /\.(html)$/,
      //   use: {
      //     loader: 'html-loader'
      //   }
      // },
      {
        test: /\.(js)$/,
        use: 'babel-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        //把 style-loader拔掉換 MiniCssExtractPlugin
        use: [MiniCssExtractPlugin.loader, "css-loader", {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          "sass-loader"
        ],
      },
      //圖片提取壓縮
      {
        test: /\.(gif|png|jpe?g|svg|webp)$/i,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              //指定 css 裡面的各個 url 前面都有 ../，修正路徑
              publicPath: '../'
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ],
      },
    ],
  },
};