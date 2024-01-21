/* eslint-disable @typescript-eslint/no-var-requires */
import { Configuration, SourceMapDevToolPlugin } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
import webpackMerge from "webpack-merge";
import baseConfig, { extensionManifestPath } from "./webpack.base";
const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader");

function getExtensionReloaderEntryOptions(config: Configuration) {
  const webpackEntries = config.entry;

  if (typeof webpackEntries !== "object") {
    throw new Error("Build error: expected webpack entries to be an object.");
  }

  return Object.keys(baseConfig.entry).reduce((acc, key) => {
    if (key === "extension") {
      acc["extensionPage"] = key;
      return acc;
    }

    acc[key] = key;

    return acc;
  }, {});
}

const config: Configuration = webpackMerge(baseConfig, {
  mode: "development",
  devtool: "source-map",
  plugins: [
    new SourceMapDevToolPlugin(),
    new ExtensionReloaderWebpackPlugin({
      port: 9090,
      reloadPage: true,
      manifest: extensionManifestPath,
      entries: getExtensionReloaderEntryOptions(baseConfig)
    })
  ]
});

export default config;
