const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';
module.exports = [
  {
    entry: './app/index.tsx',
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: 'index.js',
      path: path.join(__dirname, 'dist', 'public')
    },
    target: 'web',
    mode,
    devtool,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          exclude: /node_modules/,
          options: {
            compilerOptions: {
              "sourceMap": !isProduction,
            }
          }
        }
      ]
    },
    "plugins": [
      new HtmlWebpackPlugin({ template: './app/index.html' })
    ]
  },
];
