import fs from "fs";
import path from "path";
import { ExtensionEntries } from "webpack";
import { ExtensionPaths } from "./paths";
import { EntrySourceFileMap } from "./types";

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

export function outputFilePath(importFilePath: string) {
  const outputFileDir = path.relative(ExtensionPaths.get("src"), path.dirname(importFilePath));
  return outputFileDir.length > 0
    ? path.join(`js`, outputFileDir, `[name].js`)
    : path.join(`js`, `[name].js`);
}

export function createWebpackEntries(sourceFileMap: EntrySourceFileMap): ExtensionEntries {
  return Object.entries(sourceFileMap).reduce<ExtensionEntries>((acc, [entryName, entryObject]) => {
    if (typeof entryObject === "string") {
      console.log(`\t'${entryName}' -> '${entryObject}'`);

      return {
        ...acc,
        [entryName]: entryObject
      };
    }

    console.log(`\n[webpack] Creating '${entryName}' entries:`);

    return {
      ...acc,
      ...createWebpackEntries(entryObject)
    };
  }, {});
}

export function entryLog(entries: ExtensionEntries, options: { pathsRelativeTo: string }) {
  return Object.entries(entries).reduce((acc, [entryKey, entryDefinition]) => {
    return {
      ...acc,
      [entryKey]: path.relative(options.pathsRelativeTo, entryDefinition)
    };
  }, {});
}

export function createExtensionReloaderEntries(entries: ExtensionEntries) {
  return {
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
