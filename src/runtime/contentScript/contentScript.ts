import { errorLog } from "runtime/services/log";
import { contentScriptRuntimeHandler } from "./message-handlers";

try {
  const contentScriptPort = chrome.runtime.connect();
  contentScriptPort.onMessage.addListener(contentScriptRuntimeHandler);
} catch (error) {
  console.error(errorLog("Unable to connect to service worker.", error));
}
