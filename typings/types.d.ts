import { EntryObject } from "webpack";

declare module "webpack" {
  export type EntryDescription =
    | string
    | Exclude<EntryObject[keyof EntryObject], string | string[]>;
}

export = {};
