import fs from "fs";
import path from "path";
import { findFileInDirectory } from "./functions.config";

/**
 * Configuration paths relative to the directory containing this file.
 */
export class ExtensionPaths {
  public static readonly WORKSPACE_PATH = process.cwd();
  public static readonly SRC_PATH = path.relative(ExtensionPaths.WORKSPACE_PATH, "src");
  public static readonly PUBLIC_PATH = path.relative(ExtensionPaths.WORKSPACE_PATH, "public");
  public static readonly EXTENSION_PANEL_TEMPLATE_PATH = path.resolve(
    ExtensionPaths.PUBLIC_PATH,
    "panel.html"
  );
  public static readonly OUTPUT_PATH = path.join(ExtensionPaths.WORKSPACE_PATH, "dist");

  static getOutputManifest(): string {
    return path.resolve(ExtensionPaths.OUTPUT_PATH, "manifest.json");
  }

  static getOutputScript(scriptId: string) {
    const scriptPath = findFileInDirectory(ExtensionPaths.OUTPUT_PATH, `${scriptId}.js`);

    if (fs.existsSync(scriptPath)) {
      return scriptPath;
    } else {
      throw new Error(`[webpack] Configured script '${scriptId}' does not exist.`);
    }
  }
}
