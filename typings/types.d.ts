import { Configuration as WebpackConfig } from "webpack";

declare module "webpack" {
  export type ExtensionEntryDescription = {
    import: string;
    filename: string;
  };

  export type WebpackConfiguration = WebpackConfig;

  export interface ExtensionEntries {
    [index: string]: string;
  }

  type WebpackOutput = WebpackConfiguration["output"];

  export interface ExtensionConfiguration extends WebpackConfig {
    entry?: ExtensionEntries;
    // output?: {
    //   path: WebpackOutput["path"];
    //   filename: Exclude<WebpackOutput["filename"], string>;
    // };
    output?: WebpackConfig["output"];
  }
}

export = {};
