export type WebpackConfigEntrySource = {
  [key: string]: { srcFilePath: string; buildOutputDir: string };
};

export type WebpackConfigEntrySourceMap = {
  renderer: WebpackConfigEntrySource;
  runtime: WebpackConfigEntrySource;
};
