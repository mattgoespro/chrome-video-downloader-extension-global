import { EntryObject } from "webpack";

declare module "webpack" {
  export type EntryDescription = Exclude<EntryObject[keyof EntryObject], string | string[]>;
}

export = {};
