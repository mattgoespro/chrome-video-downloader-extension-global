import { Configuration, SourceMapDevToolPlugin } from "webpack";
import webpackMerge from "webpack-merge";
import { WebpackVariables } from "../webpack.config";
import baseConfiguration from "./base.config";
import {
  ExtensionReloaderWebpackPlugin,
  createExtReloaderEntryConfigFromWebpack,
  findFile
} from "./functions.config";

const devConfig: (variables: WebpackVariables) => Configuration = (variables) => {
  const baseConfig = baseConfiguration(variables);
  const extReloaderEntryConfig = createExtReloaderEntryConfigFromWebpack(baseConfig);

  console.log(`\n\nCreated 'webpack-ext-reloader' entries from webpack configuration.\n`);
  console.table(extReloaderEntryConfig);

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
        entries: extReloaderEntryConfig
      })
    ]
  });
};

export default devConfig;
