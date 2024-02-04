import path from "path";

const workspacePath = path.resolve(__dirname, "..");

const srcPath = `${workspacePath}/src`;
const publicPath = `${workspacePath}/public`;
const outputPath = `dist`;

const runtimeSrcPath = `${srcPath}/runtime`;
const rendererSrcPath = `${srcPath}/renderer`;

const jsOutputDirName = `js`;
const runtimeOutputDir = `${jsOutputDirName}/runtime`;
const rendererOutputDir = `${jsOutputDirName}/renderer`;

export default {
  workspacePath,
  srcPath,
  publicPath,
  outputPath,
  runtimeSrcPath,
  rendererSrcPath,
  jsOutputDirName,
  runtimeOutputDir,
  rendererOutputDir
};
