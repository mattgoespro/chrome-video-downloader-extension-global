import { ExtensionConfiguration } from "webpack";
import webpackMerge from "webpack-merge";
import baseConfig from "./base.config";
import { createExtensionReloaderEntries } from "./functions";
import { ExtensionPaths } from "./paths";
import { ExtensionReloaderWebpackPlugin } from "./types";

const devConfig: () => ExtensionConfiguration = () => {
  if (typeof baseConfig.entry !== "object") {
    throw new Error("[webpack] Expected base configuration entries to be of type 'EntryObject'.");
  }

  const extensionReloaderEntries = createExtensionReloaderEntries(baseConfig.entry);

  console.log("[webpack] Configured Extension Reloader entries:");
  console.table(extensionReloaderEntries);

  return webpackMerge(baseConfig, {
    mode: "development",
    devtool: "inline-source-map",
    optimization: {
      minimize: false
    },
    plugins: [
      new ExtensionReloaderWebpackPlugin({
        port: 9090,
        reloadPage: true,
        manifest: ExtensionPaths.get("manifest.json"),
        entries: extensionReloaderEntries
      })
    ]
  });
};

export default devConfig;
