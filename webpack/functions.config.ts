import fs from "fs";
import { posix as path } from "path";
import { ExtensionConfiguration, ExtensionOutput, ExtensionEntries } from "webpack";
import { ExtensionReloader } from "webpack-ext-reloader";
import { WebpackVariables } from "webpack.config";
import { WebpackConfigEntrySourceMap } from "./types.config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader"); // 'webpack-ext-reloader' types are broken

export function pause(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

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

export function pathRelativeToWorkspace(workspaceDirPath: string, toPath: string) {
  return path.relative(workspaceDirPath, toPath);
}

export function outputFilePath(
  workspaceDirPath: string,
  importFilePath: string,
  outputConfigPrefixDir: string
) {
  const fileName = path.basename(importFilePath, path.extname(importFilePath));
  const fileDirectory = pathRelativeToWorkspace(workspaceDirPath, path.parse(importFilePath).dir)
    .split(path.sep)
    .slice(1)
    .join(path.sep);
  const prefixDir = outputConfigPrefixDir.replace("/[name].js", "");
  console.log("prefix dir", prefixDir);
  console.log("file directory", fileDirectory);
  console.log("file name", `${fileName}.js`);
  const outputFilePath = [prefixDir];

  if (fileDirectory.trim().length > 0) {
    outputFilePath.push(fileDirectory);
  }

  return [...outputFilePath, `${fileName}.js`].join(path.sep);
}

export function createWebpackEntries(
  entryMap: WebpackConfigEntrySourceMap,
  outputConfig: ExtensionOutput,
  variables: WebpackVariables
): ExtensionEntries {
  return Object.entries(entryMap).reduce((acc, [entryKey, fileEntry]) => {
    if (typeof fileEntry === "string") {
      console.log(`[webpack] Creating default '${entryKey}' -> '${fileEntry}'`);
      return {
        ...acc,
        [entryKey]: fileEntry
      };
    }

    console.log(`\n[webpack] Creating entries for '${entryKey}'...`);
    const outputFile = outputFilePath(
      variables.workspacePath,
      fileEntry.srcFilePath,
      outputConfig.filename
    );
    console.log(`[webpack] Created '${entryKey}' -> '${outputFile}'`);

    return {
      ...acc,
      [entryKey]: {
        import: fileEntry.srcFilePath,
        filename: outputFile
      }
    };
  }, {});
}

export function logEntries(config: ExtensionConfiguration, workspaceDir: string) {
  const entryLogMap = Object.entries(config.entry).reduce<ExtensionEntries>(
    (currentMap, [entryKey, entryDefinition]) => {
      let entryLog = null;

      if (typeof entryDefinition === "string") {
        entryLog = {
          import: pathRelativeToWorkspace(workspaceDir, entryDefinition),
          filename: "Default"
        };
      } else {
        const entryFilePath = entryDefinition.import;

        entryLog = Array.isArray(entryFilePath)
          ? entryFilePath.join(", ")
          : {
              import: pathRelativeToWorkspace(workspaceDir, entryFilePath),
              filename: entryDefinition.filename
            };
      }

      return {
        ...currentMap,
        [entryKey]: entryLog
      };
    },
    {}
  );

  console.table(entryLogMap);
}
