
var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
//var SplitByPathPlugin = require('webpack-split-by-path');

const paths = {
  STATIC: path.resolve(__dirname, 'static/dist'),
  SRC: path.resolve(__dirname, 'src'), // source folder path -> ADDED IN THIS STEP
  JS: path.resolve(__dirname, 'src/'),
};


  // Webpack configuration
  module.exports = {
    entry: path.join(paths.JS, '/js/index.js'),

    output: {
      path: paths.STATIC,
      filename: 'app.bundle.js',
      
    },
    // Dev server configuration -> ADDED IN THIS STEP
    // Now it uses our "src" folder as a starting point
    devServer: {
      contentBase: paths.SRC,
      hot : true,
    },

  context: __dirname,
  node: {
    __dirname: true
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    /*
    new SplitByPathPlugin([
      {
        name: 'vendor',
        path: path.join(__dirname, './node_modules/')
      }
    ])*/
  ],
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', "@babel/react"],
                    "plugins": [
                      [
                        "@babel/plugin-proposal-class-properties"
                      ]
                  ]
                }
            }
        },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
        { test: /\.json$/, loader: "json-loader" },
        { test: /\.(png|jpeg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
        {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }

};