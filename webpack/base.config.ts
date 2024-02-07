import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin } from "webpack";
import { WebpackVariables } from "../webpack.config";
import { createWebpackEntries, findFile } from "./functions.config";
import { WebpackConfigEntrySourceMap } from "./types.config";

const baseConfig: (webpackVariables: WebpackVariables) => Configuration = (variables) => {
  const entryMap: WebpackConfigEntrySourceMap = {
    renderer: {
      extension: {
        srcFilePath: findFile(variables.rendererSrcPath, "extension.tsx"),
        buildOutputDir: variables.rendererOutputDir
      }
    },
    runtime: {
      background: {
        srcFilePath: findFile(variables.runtimeSrcPath, "background.ts"),
        buildOutputDir: variables.runtimeOutputDir
      },
      contentScript: {
        srcFilePath: findFile(variables.runtimeSrcPath, "contentScript.ts"),
        buildOutputDir: variables.runtimeOutputDir
      }
    }
  };

  console.table(entryMap.renderer);
  console.table(entryMap.runtime);

  const webpackEntries = createWebpackEntries(entryMap);

  console.log(`\n\nCreated Webpack entries based on the provided entry map.\n`);
  console.table(webpackEntries);

  return {
    context: __dirname, // favicon webpack plugin resolves paths relative current directory
    stats: "errors-warnings",
    // entry: webpackEntries,
    entry: {
      extension: {
        import: entryMap.renderer["extension"].srcFilePath
      }
    },
    output: {
      path: path.resolve(__dirname, variables.outputPath),
      filename: `[name].js`
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
        template: path.join(variables.publicPath, "panel.html"),
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
        logo: path.join(variables.publicPath, "assets", "logo.png"),
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
