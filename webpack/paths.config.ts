// path.dir = path.dirname;

import path from "path";

const workspacePath = process.cwd();
const srcPath = path.relative(workspacePath, "src");
const publicPath = path.relative(workspacePath, "public");

/**
 * Configuration paths relative to the directory containing this file.
 */
export const paths = {
  workspacePath,
  srcPath,
  publicPath
};
