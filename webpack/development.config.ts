import { Configuration, SourceMapDevToolPlugin } from "webpack";
import webpackMerge from "webpack-merge";
import baseConfiguration from "./base.config";
import { ExtensionReloaderWebpackPlugin, createExtensionReloaderEntries } from "./functions.config";
import { ExtensionPaths } from "./paths.config";

const devConfig: () => Configuration = () => {
  const baseConfig = baseConfiguration();

  if (typeof baseConfig.entry !== "object") {
    throw new Error("[webpack] Expected base configuration entries to be of type 'EntryObject'.");
  }

  const extensionReloaderEntries = createExtensionReloaderEntries(baseConfig.entry);

  console.log("[webpack] Configured Extension Reloader entries:");
  console.table(extensionReloaderEntries);

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
        manifest: ExtensionPaths.getOutputManifest(),
        entries: extensionReloaderEntries
      })
    ]
  });
};

export default devConfig;
