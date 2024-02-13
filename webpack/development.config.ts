import { Configuration, SourceMapDevToolPlugin } from "webpack";
import webpackMerge from "webpack-merge";
import baseConfiguration from "./base.config";
import {
  findFileInDirectory,
  ExtensionReloaderWebpackPlugin,
  outputFilePath,
  createExtensionReloaderEntries
} from "./functions.config";
import { paths } from "./paths.config";

const devConfig: () => Configuration = () => {
  const baseConfig = baseConfiguration();

  if (typeof baseConfig.entry !== "object") {
    throw new Error("[webpack] Expected base configuration entries to be of type 'EntryObject'.");
  }

  const extensionReloaderEntries = createExtensionReloaderEntries("panel", baseConfig.entry);

  console.log("[webpack] Configured Extension Reloader entries:");
  console.table(extensionReloaderEntries);
  console.log(findFileInDirectory(paths.srcPath, "manifest.json"));
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
        manifest: findFileInDirectory(paths.srcPath, "manifest.json")
      })
    ]
  });
};

export default devConfig;
