import TerserWebpackPlugin from "terser-webpack-plugin";
import { ExtensionConfiguration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./base.config";

const prodConfig: () => ExtensionConfiguration = () => {
  return merge(baseConfig, {
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
};

export default prodConfig;
