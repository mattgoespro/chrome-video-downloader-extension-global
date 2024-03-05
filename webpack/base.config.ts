import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { EnvironmentPlugin, ExtensionConfiguration } from "webpack";
import { findFileInDirectory } from "./functions";
import { ExtensionPaths } from "./paths";

const baseConfig: ExtensionConfiguration = {
  context: ExtensionPaths.get("WORKSPACE"), // Favicon webpack plugin resolves paths relative to webpack context
  stats: "errors-warnings",
  entry: {
    extension: findFileInDirectory(ExtensionPaths.get("src"), "extension.tsx"),
    contentScript: findFileInDirectory(ExtensionPaths.get("src"), "contentScript.ts"),
    background: findFileInDirectory(ExtensionPaths.get("src"), "background.ts")
  },
  output: {
    path: ExtensionPaths.getOutput(),
    filename: "js/[name].js",
    sourceMapFilename: "map/[name].js.map",

    devtoolModuleFilenameTemplate: "chrome-video-downloader-extension-global:///src/[resource-path]"
    // publicPath: "./"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "webextension-polyfill-ts": path.resolve(
        path.join(__dirname, "node_modules", "webextension-polyfill-ts")
      )
    },
    plugins: [new TsConfigPathsWebpackPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(js|ts)x?$/,
        use: [
          {
            loader: "babel-loader",
            options: { include: [path.resolve(ExtensionPaths.get("src"))] }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin(["TARGET_BROWSER", "MODE"]),
    new CleanWebpackPlugin({
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: "extension.html",
      template: path.join(ExtensionPaths.get("public"), "extension.html"),
      inject: "body",
      chunks: ["extension"],
      hash: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: ExtensionPaths.get("manifest.json"),
          to: ExtensionPaths.getOutput()
        }
      ]
    }),
    new FaviconsWebpackPlugin({
      logo: path.join(ExtensionPaths.get("public"), "assets", "logo.png"),
      mode: "webapp",
      cache: true,
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          windows: false,
          yandex: false,
          favicons: true
        }
      }
    })
  ]
};

export default baseConfig;
