import { infoLog } from "runtime/services/log";
import { createMenuItems, toggleContextMenuItems } from "./context-menu";
import { backgroundRuntimeHandler } from "./message-handlers";

createMenuItems();

const BackgroundActiveUrls = [new RegExp(/^https:\/\/.*$/g)] as const;

function withUrlValidation<T = unknown>(tabUrl: string, fn: () => T) {
  if (
    !BackgroundActiveUrls.some((url) => {
      return url.test(tabUrl);
    })
  ) {
    console.log(infoLog(["Background script inactive for URL:", tabUrl ?? "Chrome"]));
    return;
  }

  return fn();
}

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") {
    console.log(infoLog("Waiting for tab to load..."));
    return;
  }

  withUrlValidation(tab.url, async () => {
    await toggleContextMenuItems({ enabled: true });
  });
});

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") {
    console.log(infoLog("Waiting for tab to load..."));
    return;
  }

  withUrlValidation(tab.url, async () => {
    chrome.runtime.onConnect.addListener((port) => {
      console.log(
        infoLog([
          "Connection established in background script:",
          port?.name ?? "Unrecognized port",
          "Sender:",
          port.sender
        ])
      );

      port.onMessage.addListener(backgroundRuntimeHandler);
    });
  });
});
