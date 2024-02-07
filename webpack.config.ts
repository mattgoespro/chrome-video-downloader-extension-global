import path from "path";
import { Configuration } from "webpack";
import developmentConfig from "./webpack/development.config";
import productionConfig from "./webpack/production.config";

const workspacePath = ".";

const srcPath = `${workspacePath}/src`;
const publicPath = `${workspacePath}/public`;
const outputPath = `${workspacePath}/dist`;
const jsOutputDirName = `${workspacePath}/js`;

/**
 * Configuration paths relative to the directory containing this file.
 */
const variables = {
  workspacePath,
  srcPath,
  publicPath,
  outputPath,
  jsOutputDirName,
  runtimeSrcPath: `${srcPath}/runtime`,
  rendererSrcPath: `${srcPath}/renderer`,
  runtimeOutputDir: `${jsOutputDirName}/runtime`,
  rendererOutputDir: `${jsOutputDirName}/renderer`
};

export type WebpackVariables = typeof variables;

// export function absolutePath(variable: keyof WebpackVariables, ...pathParts: string[]): string {
//   console.log(variables);
//   console.log(variable);
//   console.log(variables[variable]);
//   return path.resolve(__dirname, variables[variable], ...(pathParts ?? []));
// }

let config: Configuration = null;

switch (process.env.MODE) {
  case "development":
    config = developmentConfig(variables);
    break;
  case "production":
    config = productionConfig(variables);
    break;
  default:
    throw new Error("'MODE' is not set");
}

console.log(config);

export default config;
