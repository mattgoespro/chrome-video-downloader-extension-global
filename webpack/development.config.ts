import { Configuration, SourceMapDevToolPlugin } from "webpack";
import webpackMerge from "webpack-merge";
import baseConfig from "./base.config";
import {
  ExtensionReloaderWebpackPlugin,
  createExtReloaderEntryConfigFromWebpack
} from "./functions.config";
import variables from "./variables.config";

// console.log(
//   `[ExtensionReloaderWebpackPlugin] Entry configuration: `,
//   Object.entries(extReloaderEntries)
//     .map(([entryName, entryValue]) => `${entryName} -> '${entryValue}'`)
//     .join("\n")
// );

const config: Configuration = webpackMerge(baseConfig, {
  mode: "development",
  devtool: false,
  optimization: {
    minimize: false,
    chunkIds: "named"
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
      manifest: `${variables.outputPath}/manifest.json`,
      entries: createExtReloaderEntryConfigFromWebpack(baseConfig)
    })
  ]
});

export default config;
