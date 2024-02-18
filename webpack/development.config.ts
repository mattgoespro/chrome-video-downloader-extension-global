import { ExtensionConfiguration, SourceMapDevToolPlugin } from "webpack";
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
      // new SourceMapDevToolPlugin({
      //   filename: "[file].map",
      //   // append: (pathData) => {
      //   //   console.log([...pathData.chunk["_groups"]].map((g) => g.origins[0].request));
      //   //   return `//#sourceMappingUrl=${pathData.chunk.name}.map.js`;
      //   // }
      //   append: null,
      //   module: true,
      //   columns: true,
      //   noSources: false
      //   // namespace: "Video Downloader"
      // }),
      new ExtensionReloaderWebpackPlugin({
        port: 9090,
        reloadPage: true,
        manifest: ExtensionPaths.getOutputFile("manifest.json"),
        entries: extensionReloaderEntries
      })
    ]
  });
};

export default devConfig;
