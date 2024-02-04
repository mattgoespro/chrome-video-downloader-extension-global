import fs from "fs";
import path from "path";
import { EntryObject, EntryDescription, Configuration } from "webpack";

export type WebpackConfigEntry = {
  [key: string]: { srcFilePath: string; outputFilePath: string };
};

export type WebpackConfigEntryMap = { renderer: WebpackConfigEntry; runtime: WebpackConfigEntry };

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const ExtensionReloaderWebpackPlugin = require("webpack-ext-reloader"); // 'webpack-ext-reloader' types are broken

export function findFile(directory: string, fileName: string): string | null {
  const dirEntries = fs.readdirSync(directory, { withFileTypes: true });

  for (const dirEntry of dirEntries) {
    const dirPath = path.join(directory, dirEntry.name);

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

export function createWebpackEntries(entryMap: WebpackConfigEntryMap): {
  [key: string]: EntryDescription;
} {
  return Object.entries(entryMap).reduce((acc, [entryFileType, fileEntry]) => {
    console.log(`[webpack] Creating entries for type '${entryFileType}':`);

    return {
      ...acc,
      ...Object.entries(fileEntry).reduce((acc, [entryName, entryData]) => {
        const entryOutputFile = path.basename(
          entryData.srcFilePath,
          path.extname(entryData.srcFilePath)
        );
        const fileEntryDescription: EntryDescription = {
          import: entryData.srcFilePath,
          filename: `${entryData.outputFilePath}/${entryOutputFile}.js`
        };

        console.log(
          `\tCreated entry '${entryName}' -> { import=${fileEntryDescription.import}, filename=${fileEntryDescription.filename} }`
        );

        return {
          ...acc,
          [entryName]: fileEntryDescription
        };
      }, {})
    };
  }, {});
}

export function createExtReloaderEntryConfigFromWebpack(webpackConfig: Configuration) {
  if (typeof webpackConfig.entry !== "object" || Array.isArray(webpackConfig.entry)) {
    throw new Error("[ExtensionReloaderWebpackPlugin] Webpack entries must be an object");
  }

  const webpackEntries: EntryObject = webpackConfig.entry;

  return Object.entries(webpackEntries).reduce(
    (acc, [webpackEntryName, webpackEntryDescription]: [string, EntryDescription]) => {
      if (webpackEntryName === "extension") {
        webpackEntryName = "extensionPage";
      }

      if (typeof webpackEntryDescription.filename !== "string") {
        throw new Error(
          "[ExtensionReloaderWebpackPlugin] Webpack entry value 'filename' must be of type 'string'"
        );
      }

      // const filename = webpackEntryDescription.filename.split("/").slice(1).join("/");

      console.log(
        `[ExtensionReloaderWebpackPlugin] Created entry '${webpackEntryName}' -> '${webpackEntryDescription.filename}'`
      );

      return {
        ...acc,
        [webpackEntryName]: webpackEntryDescription.filename
      };
    },
    {}
  );
}
