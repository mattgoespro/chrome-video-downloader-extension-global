import TerserWebpackPlugin from "terser-webpack-plugin";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import { WebpackVariables } from "../webpack.config";
import baseConfig from "./base.config";

const prodConfig: (variables: WebpackVariables, outputPath: string) => Configuration = (
  variables,
  outputPath
) => {
  return merge(baseConfig(variables, outputPath), {
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
