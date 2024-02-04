import { errorLog, infoLog } from "runtime/services/utils";
import { contentScriptRuntimeHandler } from "./message-handlers";

chrome.runtime.onStartup.addListener(() => {
  try {
    const contentScriptPort = chrome.runtime.connect();
    console.log(infoLog(["Connected to service worker on port:", contentScriptPort]));
    contentScriptPort.onMessage.addListener(contentScriptRuntimeHandler);
  } catch (error) {
    console.error(errorLog("Unable to connect to service worker.", error));
  }
});
