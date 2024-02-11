import { posix as path } from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { EnvironmentPlugin, ExtensionConfiguration, ExtensionOutput } from "webpack";
import { WebpackVariables } from "../webpack.config";
import { findFile, createWebpackEntries } from "./functions.config";

const baseConfig: (
  webpackVariables: WebpackVariables,
  outputPath: string
) => ExtensionConfiguration = (variables, outputPath) => {
  const entryMap = {
    extension: {
      srcFilePath: findFile(variables.srcPath, "extension.tsx")
    },
    background: {
      srcFilePath: findFile(variables.srcPath, "background.ts")
    },
    contentScript: {
      srcFilePath: findFile(variables.srcPath, "contentScript.ts")
    }
  };

  const webpackOutput: ExtensionOutput = {
    path: path.resolve(outputPath),
    filename: `js/[name].js` // generates the entry output filename when the entry itself does not defined it
  };

  const extensionEntries = createWebpackEntries(entryMap, webpackOutput, variables);
  console.log("[webpack] Converted extension entry map to webpack entry map:");
  console.log(extensionEntries);

  return {
    context: __dirname, // favicon webpack plugin resolves paths relative current directory
    stats: "errors-warnings",
    entry: extensionEntries,
    output: webpackOutput,
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        "webextension-polyfill-ts": path.resolve(
          __dirname,
          "node_modules",
          "webextension-polyfill-ts"
        )
      },
      plugins: [
        new TsConfigPathsWebpackPlugin({
          configFile: path.join(__dirname, "..", "tsconfig.json")
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
              options: { include: [path.resolve(variables.srcPath)] }
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
        filename: "panel.html",
        template: path.resolve(variables.publicPath, "panel.html"),
        inject: "body",
        chunks: ["extension"],
        hash: false,
        scriptLoading: "module"
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(variables.srcPath, "manifest.json"),
            to: "manifest.json" // 'to' path is relative to output.path
          }
        ]
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(variables.publicPath, "assets", "logo.png"),
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
};

export default baseConfig;
