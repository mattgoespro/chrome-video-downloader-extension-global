import developmentConfig from "./webpack/development.config";
import { pathRelativeToWorkspace } from "./webpack/functions.config";
import productionConfig from "./webpack/production.config";

const workspacePath = ".";

const srcPath = pathRelativeToWorkspace(workspacePath, "src");
const publicPath = pathRelativeToWorkspace(workspacePath, "public");
const outputPath = pathRelativeToWorkspace(workspacePath, "dist");

/**
 * Configuration paths relative to the directory containing this file.
 */
const variables = {
  workspacePath,
  srcPath,
  publicPath,
  runtimeSrcPath: `${srcPath}/runtime`,
  rendererSrcPath: `${srcPath}/renderer`
};

console.log(variables);

export type WebpackVariables = typeof variables;

let config = null;

switch (process.env.MODE) {
  case "development":
    config = developmentConfig(variables, outputPath);
    break;
  case "production":
    config = productionConfig(variables, outputPath);
    break;
  default:
    throw new Error("'MODE' is not set");
}

export default config;
