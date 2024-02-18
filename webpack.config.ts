import { ExtensionConfiguration } from "webpack";
import developmentConfig from "./webpack/development.config";
import productionConfig from "./webpack/production.config";

let config: ExtensionConfiguration = null;

switch (process.env.MODE) {
  case "development":
    config = developmentConfig();
    break;
  case "production":
    config = productionConfig();
    break;
  default:
    throw new Error("'MODE' is not set");
}

export default config;
