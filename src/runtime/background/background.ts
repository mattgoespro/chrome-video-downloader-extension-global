import { infoLog } from "runtime/services/log";
import { createMenuItems, toggleContextMenuItems } from "./context-menu";
import { backgroundRuntimeHandler } from "./message-handlers";

chrome.runtime.onInstalled.addListener(async () => {
  await createMenuItems();
});

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, _tab) => {
  if (changeInfo.status !== "complete") {
    // console.log(infoLog("Waiting for tab to load..."));
    return;
  }

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

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, _tab) => {
  if (changeInfo.status !== "complete") {
    console.log(infoLog("Waiting for tab to load..."));
    return;
  }

  await toggleContextMenuItems({ enabled: true });
});
