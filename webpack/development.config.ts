import { Configuration, SourceMapDevToolPlugin } from "webpack";
import webpackMerge from "webpack-merge";
import { WebpackVariables } from "../webpack.config";
import baseConfiguration from "./base.config";
import { findFile, logEntries, ExtensionReloaderWebpackPlugin } from "./functions.config";

const devConfig: (variables: WebpackVariables, outputPath: string) => Configuration = (
  variables,
  outputPath
) => {
  const baseConfig = baseConfiguration(variables, outputPath);

  if (typeof baseConfig.entry !== "object") {
    throw new Error("[webpack] Expected base configuration entries to be of type 'EntryObject'.");
  }

  console.log("[webpack] Using base configuration entries:");
  logEntries(baseConfig, variables.workspacePath, baseConfig.output.path);

  return webpackMerge(baseConfig, {
    mode: "development",
    devtool: false,
    optimization: {
      minimize: false
    },
    plugins: [
      new SourceMapDevToolPlugin({
        filename: "[file].map",
        append: null,
        module: true,
        columns: true,
        noSources: false,
        namespace: "Video Downloader"
      })
      // new ExtensionReloaderWebpackPlugin({
      //   port: 9090,
      //   reloadPage: true,
      //   manifest: findFile(variables.srcPath, "manifest.json")
      // })
    ]
  });
};

export default devConfig;
