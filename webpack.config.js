const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssFilename = 'css/styles.css';

module.exports = {
  mode: "production",
  devtool: "false",
// use development mode for debugging
// mode: "development",
// devtool: "inline-source-map",

  entry: {
    content: "./src/app/content.tsx",
    background: "./src/app/background.ts",
    installation: "./src/ui/installation.tsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: cssFilename,
    })
  ]
};
