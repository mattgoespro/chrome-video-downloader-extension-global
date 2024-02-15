import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { EnvironmentPlugin, ExtensionConfiguration } from "webpack";
import {
  findFileInDirectory,
  createWebpackEntries,
  entryLog,
  outputFilePath
} from "./functions.config";
import { paths } from "./paths.config";
import { EntrySourceFileMap } from "./types.config";

const baseConfig: () => ExtensionConfiguration = () => {
  const sourceFileMap: EntrySourceFileMap = {
    renderer: {
      extensionPage: findFileInDirectory(paths.srcPath, "extension.tsx")
    },
    runtime: {
      background: findFileInDirectory(paths.srcPath, "background.ts"),
      contentScript: findFileInDirectory(paths.srcPath, "contentScript.ts")
    }
  };

  const outputPath = path.join(paths.workspacePath, "dist");

  const extensionEntries = createWebpackEntries(sourceFileMap);

  console.log("\n[webpack] Created Configuration Entries");
  console.table(entryLog(extensionEntries, { pathsRelativeTo: paths.workspacePath }));
  console.table(extensionEntries);

  return {
    context: __dirname, // favicon webpack plugin resolves paths relative current directory
    stats: "errors-warnings",
    entry: {
      ...extensionEntries
    },
    output: {
      path: outputPath,
      filename: (pathData) => {
        const filePath = outputFilePath(extensionEntries[pathData.chunk.name]);

        console.log(`[webpack] Bundling '${pathData.chunk.name}' -> '${filePath}`);

        return filePath;
      }
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        "webextension-polyfill-ts": path.resolve(
          __dirname,
          "node_modules",
          "webextension-polyfill-ts"
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
              options: { include: [path.resolve(paths.srcPath)] }
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
        template: path.resolve(paths.publicPath, "panel.html"),
        inject: "body",
        chunks: ["extension"],
        hash: false,
        scriptLoading: "module"
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(paths.srcPath, "manifest.json"),
            to: "manifest.json" // 'to' path is relative to output.path
          }
        ]
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(paths.publicPath, "assets", "logo.png"),
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
