import { Configuration as WebpackConfiguration } from "webpack";

declare module "webpack" {
  export type ExtensionEntryDescription = {
    import: string;
    filename: string;
  };

  export interface ExtensionEntries {
    [index: string]: ExtensionEntryDescription;
  }

  export interface ExtensionOutput {
    path: string;
    filename: string;
  }

  export interface ExtensionConfiguration extends WebpackConfiguration {
    entry?: ExtensionEntries;
    output?: ExtensionOutput;
  }
}

export = {};
