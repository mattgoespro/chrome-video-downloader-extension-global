export type WebpackConfigEntrySource = {
  [key: string]: { srcFilePath: string };
};

export type WebpackConfigEntrySourceMap = {
  [key: string]: { srcFilePath: string } | string;
};
