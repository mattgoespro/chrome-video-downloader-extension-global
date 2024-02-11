import { Configuration, SourceMapDevToolPlugin } from "webpack";
import webpackMerge from "webpack-merge";
import { WebpackVariables } from "../webpack.config";
import baseConfiguration from "./base.config";
import {
  findFile,
  logEntries,
  ExtensionReloaderWebpackPlugin,
  outputFilePath
} from "./functions.config";

const devConfig: (variables: WebpackVariables, outputPath: string) => Configuration = (
  variables,
  outputPath
) => {
  const baseConfig = baseConfiguration(variables, outputPath);

  if (typeof baseConfig.entry !== "object") {
    throw new Error("[webpack] Expected base configuration entries to be of type 'EntryObject'.");
  }

  console.log("[webpack] Using base configuration entries:");
  logEntries(baseConfig, variables.workspacePath);

  console.log("[webpack] Transformed webpack entries to webpack-ext-reloader:");
  console.table({
    extensionPage: `panel.html`,
    ...Object.entries(baseConfig.entry)
      .map(([entryKey, entry]) => ({
        [entryKey]:
          typeof entry === "object"
            ? entry.filename
            : outputFilePath(variables.workspacePath, entry, baseConfig.output.filename)
      }))
      .reduce((acc, entry) => ({ ...acc, ...entry }))
  });

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
      }),
      new ExtensionReloaderWebpackPlugin({
        port: 9090,
        reloadPage: true,
        manifest: findFile(variables.srcPath, "manifest.json"),
        entries: {
          extensionPage: `panel.html`,
          ...Object.entries(baseConfig.entry)
            .map(([entryKey, entry]) => ({
              [entryKey]: typeof entry === "object" ? entry.filename : entry
            }))
            .reduce((acc, entry) => ({ ...acc, ...entry }))
        }
      })
    ]
  });
};

export default devConfig;
