import fs from "fs";
import path from "path";
import { ExtensionOutput, ExtensionEntries, ExtensionEntryDescription } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
import { paths } from "./paths.config";
import { EntrySourceFileMap } from "./types.config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader"); // 'webpack-ext-reloader' types are broken

export function findFileInDirectory(directory: string, fileName: string): string | null {
  let dir = directory;

  if (!path.isAbsolute(directory)) {
    dir = path.resolve(directory);
  }

  const dirEntries = fs.readdirSync(dir, { withFileTypes: true });

  for (const dirEntry of dirEntries) {
    const dirPath = path.join(dir, dirEntry.name);

    if (dirEntry.isDirectory()) {
      const foundFilePath = findFileInDirectory(dirPath, fileName);

      if (foundFilePath != null) {
        return foundFilePath;
      }
    } else if (dirEntry.name === fileName) {
      return dirPath;
    }
  }

  return null;
}

export function outputFilePath(importFilePath: string, configOutputFilename: string) {
  const fileName = path.basename(importFilePath, path.extname(importFilePath));
  const fileSourceDirectory = path.relative(paths.srcPath, path.dirname(importFilePath));

  // const fileOutputDirectory = path.normalize(
  //   configOutputFilename.replace("[name]", fileSourceDirectory)
  // );

  return path.join(fileSourceDirectory, `${fileName}.js`);
}

export function createWebpackEntries(
  sourceFileMap: EntrySourceFileMap,
  outputConfig: ExtensionOutput
): ExtensionEntries {
  return Object.entries(sourceFileMap).reduce<ExtensionEntries>((acc, [entryName, entryObject]) => {
    if (typeof entryObject === "string") {
      const entry: ExtensionEntryDescription = {
        import: entryObject,
        filename: outputFilePath(entryObject, outputConfig.filename)
      };

      console.log(`\t'${entryName}' -> '${entry.filename}'`);

      return {
        ...acc,
        [entryName]: entry
      };
    }

    console.log(`\n[webpack] Creating '${entryName}' entries:`);

    return {
      ...acc,
      ...createWebpackEntries(entryObject, outputConfig)
    };
  }, {});
}

export function entryLog(entries: ExtensionEntries, options: { pathsRelativeTo: string }) {
  return Object.entries(entries).reduce((acc, [entryKey, entryDefinition]) => {
    return {
      ...acc,
      [entryKey]: path.relative(options.pathsRelativeTo, entryDefinition.filename)
    };
  }, {});
}

export function createExtensionReloaderEntries(
  extensionPageEntryKey: string,
  entries: ExtensionEntries
) {
  return {
    extensionPage: extensionPageEntryKey,
    ...Object.entries(entries)
      .map(([entryKey]) => ({
        [entryKey]: entryKey
      }))
      .reduce(
        (acc, entry) => ({
          ...acc,
          ...entry
        }),
        {}
      )
  };
}
