import { log } from "runtime/services/utils";
import { contentScriptRuntimeHandler } from "./message-handlers";

const port = chrome.runtime.connect();

chrome.runtime.onConnect.addListener(() => {
  log({
    type: "info",
    message: ["Connected to extension runtime."]
  });

  port.onMessage.addListener(contentScriptRuntimeHandler);
});
