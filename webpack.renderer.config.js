const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },
  {
    test: /\.s[ac]ss$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      { loader: "sass-loader" },
    ],
  }
);

plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "assets"),
        to: "assets",
      },
    ],
  }),
);

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".sass", ".scss"],
  },
};
