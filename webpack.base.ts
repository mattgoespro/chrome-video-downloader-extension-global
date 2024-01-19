import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin } from "webpack";

export const srcPath = path.join(__dirname, "src");
export const extensionManifestPath = path.join(srcPath, "manifest.json");
export const extensionPath = path.join(srcPath, "extension");
export const publicPath = path.join(__dirname, "public");
export const distPath = path.join(__dirname, "dist");

const contentScriptsPath = path.join(extensionPath, "contentScripts");

const config: Configuration = {
  context: __dirname, // Favicon webpack plugin resolves paths relative to webpack context
  stats: "errors-warnings",
  entry: {
    background: path.join(extensionPath, "background", "background.ts"),
    contentScript: path.join(contentScriptsPath, "contentScript.ts"),
    contentScriptInjection: path.join(contentScriptsPath, "contentScriptInjection.ts"),
    logger: path.join(contentScriptsPath, "logger.ts"),
    extension: path.join(extensionPath, "extension.tsx")
  },
  output: {
    path: distPath,
    filename: "js/[name].js",
    publicPath: "./"
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
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin(["TARGET_BROWSER", "MODE"]),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [path.join(distPath, "js", "manifest.js")],
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: "panel.html",
      template: path.join(publicPath, "panel.html"),
      inject: "body",
      chunks: ["extension"],
      hash: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: extensionManifestPath,
          to: path.join(distPath, "manifest.json")
        }
      ]
    }),
    new FaviconsWebpackPlugin({
      logo: path.join(publicPath, "assets", "logo.png"),
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

export default config;
