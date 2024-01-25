import { contentScriptRuntimeHandler } from "./message-handlers";

chrome.runtime.onMessage.addListener(contentScriptRuntimeHandler);
