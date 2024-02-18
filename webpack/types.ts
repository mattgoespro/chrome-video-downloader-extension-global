import { ExtensionReloader } from "webpack-ext-reloader";

export type EntrySourceFileMap = {
  [key: string]: string | { [key: string]: string };
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const ExtensionReloaderWebpackPlugin: typeof ExtensionReloader = require("webpack-ext-reloader"); // 'webpack-ext-reloader' types are broken
