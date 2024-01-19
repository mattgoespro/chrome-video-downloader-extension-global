import TerserWebpackPlugin from "terser-webpack-plugin";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";

const config = merge(baseConfig, {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  }
});

export default config;
