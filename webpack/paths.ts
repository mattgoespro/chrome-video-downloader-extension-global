import path from "path";

/**
 * Configuration paths relative to the directory containing this file.
 */
export class ExtensionPaths {
  static paths = {
    WORKSPACE: process.cwd(),
    "manifest.json": path.join(process.cwd(), "src", "manifest.json"),
    src: path.join(process.cwd(), "src"),
    output: path.join(process.cwd(), "dist"),
    public: path.join(process.cwd(), "public"),
    "extension.html": path.join(process.cwd(), "public", "extension.html")
  };

  static getOutput() {
    return this.paths.output;
  }

  static getOutputFile<T extends PathFile<Paths> = PathFile<Paths>>(pathFile: T): string {
    return path.join(this.paths.WORKSPACE, pathFile);
  }

  static get<T extends Path<Paths> = Path<Paths>>(pathKey: T) {
    return path.resolve(this.paths[pathKey]);
  }

  static getRelative<T extends Path<Paths> = Path<Paths>>(
    pathKey: T,
    relativeTo: T = "WORKSPACE" as T
  ) {
    return path.relative(this.get(pathKey), this.get(relativeTo));
  }
}

/**
 * Represents extension path definitions.
 */
type Paths = typeof ExtensionPaths.paths;

/**
 * Represents a single configured extension path.
 */
type Path<T extends Paths> = keyof T;

/**
 * Represents an uppercase path variable usually used for resolving other paths.
 */
type PathVariable<T extends Paths> = {
  [Key in keyof T]: Key extends string ? (Uppercase<Key> extends Key ? Key : undefined) : undefined;
}[keyof T];

/**
 * Represents the configured path of a file.
 */
type PathFile<T extends Paths> = {
  [Key in keyof T]: Key extends `${infer _}.${infer _}` ? Key : undefined;
}[keyof T];
