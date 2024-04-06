import { debugging } from "runtime/services/debug";
import { infoLog } from "runtime/services/log";
import { withUrlValidation } from "runtime/services/utils";
import { createMenuItems, toggleContextMenuItems } from "./context-menu";
import { backgroundRuntimeHandler } from "./message-handlers";

createMenuItems();

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") {
    if (debugging()) {
      console.log(infoLog("Waiting for tab to load..."));
    }
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
