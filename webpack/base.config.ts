import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { EnvironmentPlugin, ExtensionConfiguration } from "webpack";
import WebpackExtensionManifestPlugin from "webpack-extension-manifest-plugin";
import manifestBaseConfig from "../src/manifest.base";
import {
  findFileInDirectory,
  createWebpackEntries,
  entryLog,
  outputFilePath
} from "./functions.config";
import { ExtensionPaths } from "./paths.config";
import { EntrySourceFileMap } from "./types.config";

const baseConfig: () => ExtensionConfiguration = () => {
  const sourceFileMap: EntrySourceFileMap = {
    renderer: {
      extensionPage: findFileInDirectory(ExtensionPaths.SRC_PATH, "extension.tsx")
    },
    runtime: {
      background: findFileInDirectory(ExtensionPaths.SRC_PATH, "background.ts"),
      contentScript: findFileInDirectory(ExtensionPaths.SRC_PATH, "contentScript.ts")
    }
  };

  const extensionEntries = createWebpackEntries(sourceFileMap);

  console.log("\n\n[webpack] Created Configuration Entries (paths relative to workspace)");
  console.table(entryLog(extensionEntries, { pathsRelativeTo: ExtensionPaths.WORKSPACE_PATH }));
  console.log("\n");

  return {
    context: __dirname, // favicon webpack plugin resolves paths relative current directory
    stats: "errors-warnings",
    entry: {
      ...extensionEntries
    },
    output: {
      path: ExtensionPaths.OUTPUT_PATH,
      filename: (pathData) => {
        const filePath = outputFilePath(extensionEntries[pathData.chunk.name]);

        console.log(`[webpack] Using filename '${pathData.chunk.name}' -> '${filePath}`);

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
              options: { include: [path.resolve(ExtensionPaths.SRC_PATH)] }
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
        template: ExtensionPaths.EXTENSION_PANEL_TEMPLATE_PATH,
        inject: "body",
        chunks: ["extensionPage"],
        hash: false,
        scriptLoading: "module"
      }),
      new WebpackExtensionManifestPlugin({
        config: {
          base: manifestBaseConfig,
          extend: {
            action: {
              default_panel: path.basename(ExtensionPaths.EXTENSION_PANEL_TEMPLATE_PATH)
            },
            side_panel: {
              default_path: path.basename(ExtensionPaths.EXTENSION_PANEL_TEMPLATE_PATH)
            },
            background: {
              service_worker: path.relative(
                ExtensionPaths.OUTPUT_PATH,
                ExtensionPaths.getOutputScript("background")
              )
            },
            content_scripts: [
              {
                js: [
                  path.relative(
                    ExtensionPaths.OUTPUT_PATH,
                    ExtensionPaths.getOutputScript("contentScript")
                  )
                ],
                matches: [
                  "https://*/video/*",
                  "https://*/*/video/*",
                  "https://*/videos/*",
                  "https://*/*/videos/*",
                  "https://*/watch/*",
                  "https://*/*/watch/*",
                  "https://*/embed/*",
                  "https://*/*/embed/*"
                ]
              }
            ]
          }
        },
        pkgJsonProps: ["version"]
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(ExtensionPaths.PUBLIC_PATH, "assets", "logo.png"),
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
