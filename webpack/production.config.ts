import TerserWebpackPlugin from "terser-webpack-plugin";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import { WebpackVariables } from "../webpack.config";
import baseConfig from "./base.config";

const prodConfig: (variables: WebpackVariables) => Configuration = (variables) => {
  console.log(`\n\n`);
  return merge(baseConfig(variables), {
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
