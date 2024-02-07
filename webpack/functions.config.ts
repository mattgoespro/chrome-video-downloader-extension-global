import fs from "fs";
import path from "path";
import { EntryObject, EntryDescription, Configuration } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
import { WebpackConfigEntrySourceMap } from "./types.config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader"); // 'webpack-ext-reloader' types are broken

export function findFile(directory: string, fileName: string): string | null {
  let dir = directory;

  if (!path.isAbsolute(directory)) {
    dir = path.resolve(directory);
  }

  const dirEntries = fs.readdirSync(dir, { withFileTypes: true });

  for (const dirEntry of dirEntries) {
    const dirPath = path.join(dir, dirEntry.name);

    if (dirEntry.isDirectory()) {
      const foundFilePath = findFile(dirPath, fileName);

      if (foundFilePath != null) {
        return foundFilePath;
      }
    } else if (dirEntry.name === fileName) {
      return dirPath;
    }
  }

  return null;
}

export function createWebpackEntries(entryMap: WebpackConfigEntrySourceMap): {
  [key: string]: EntryDescription;
} {
  return Object.entries(entryMap).reduce((acc, [entryFileType, fileEntry]) => {
    console.log(`\n[webpack] Creating entries for '${entryFileType}'...`);

    return {
      ...acc,
      ...Object.entries(fileEntry).reduce((acc, [entryName, entryData]) => {
        const entryOutputFile = path.basename(
          entryData.srcFilePath,
          path.extname(entryData.srcFilePath)
        );
        const fileEntryDescription: EntryDescription = {
          import: entryData.srcFilePath,
          filename: path.join(entryData.buildOutputDir)
        };

        console.log(
          `\t'${entryName}' -> \n\t\tSource: ${fileEntryDescription.import}\n\t\tTarget: ${fileEntryDescription.filename}\n`
        );

        return {
          ...acc,
          [entryName]: fileEntryDescription
        };
      }, {})
    };
  }, {});
}

export function createExtReloaderEntryConfigFromWebpack(webpackConfig: Configuration): {
  [key: string]: string;
} {
  if (typeof webpackConfig.entry !== "object" || Array.isArray(webpackConfig.entry)) {
    throw new Error(
      "[ExtensionReloaderWebpackPlugin] Webpack entries must be of type 'EntryObject'"
    );
  }

  const webpackEntries: EntryObject = webpackConfig.entry;

  return Object.entries(webpackEntries).reduce(
    (acc, [webpackEntryName, webpackEntryDescription]: [string, EntryDescription]) => {
      let entryName = webpackEntryName;
      if (webpackEntryName === "extension") {
        entryName = "extensionPage";
      }
      let file = null;

      if (typeof webpackEntryDescription === "string") {
        file = webpackEntryDescription;
      } else if (typeof webpackEntryDescription === "object") {
        file = webpackEntryDescription.filename;
      }

      // const filename = webpackEntryDescription.filename.split("/").slice(1).join("/");

      console.log(`[ExtensionReloaderWebpackPlugin] Created '${webpackEntryName}' -> '${file}'`);

      return {
        ...acc,
        [entryName]: file
      };
    },
    {}
  );
}
