import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin } from "webpack";

export const srcPath = path.join(__dirname, "src");
export const extensionManifestPath = path.join(srcPath, "manifest.json");

const runtimePath = path.join(srcPath, "runtime");
const rendererPath = path.join(srcPath, "renderer");
const publicPath = path.join(__dirname, "public");
const distPath = path.join(__dirname, "dist");
const contentScriptPath = path.join(runtimePath, "contentScript");

const config: Configuration = {
  context: __dirname, // Favicon webpack plugin resolves paths relative to webpack context
  stats: "errors-warnings",
  entry: {
    extension: path.join(rendererPath, "extension.tsx"),
    contentScript: path.join(contentScriptPath, "contentScript.ts"),
    background: path.join(runtimePath, "background", "background.ts")
  },
  output: {
    path: distPath,
    filename: "js/[name].js",
    publicPath: "./",
    sourceMapFilename: "[file].map"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "webextension-polyfill-ts": path.resolve(
        path.join(__dirname, "node_modules", "webextension-polyfill-ts")
      )
    },
    plugins: [
      new TsConfigPathsWebpackPlugin({
        configFile: path.join(__dirname, "tsconfig.json")
      })
    ]
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
            options: { include: [path.resolve(srcPath)] }
          }
        ],
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
      chunks: ["extension", "contentScript", "background"],
      hash: false
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
