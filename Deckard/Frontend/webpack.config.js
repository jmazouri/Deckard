var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../wwwroot/dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              'js': 'ts-loader'
              //'scss': 'vue-style-loader!css-loader!resolve-url-loader!sass-loader?sourceMap'
            },
            esModule: true
            // other vue-loader options go here
        }
      },
      {
          test: /\.(png|jpg|gif|ttf|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
      },
      {
            test: /\.scss$/,
            use:
            [
                { loader: "style-loader/useable" }, { loader: "css-loader" },
                { loader: "resolve-url-loader"}, { loader: "sass-loader?sourceMap" }
            ]
      },
      { 
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] } 
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: 'source-map'
}

if (process.env.NODE_ENV === 'production')
{
    module.exports.devtool = '#source-map';

    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}
