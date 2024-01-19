import { PingMessage, ScrapeVideoDetailsMessage } from "video-downloader/messages";
import { runtimeHandler } from "./handlers";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.log("Error creating panel:", error));

chrome.contextMenus.create({
  id: "download-video",
  title: "Download Video...",
  contexts: ["action"]
});

chrome.contextMenus.create({
  id: "download-video-as",
  title: "Download Video as...",
  contexts: ["action"]
});

chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
  if (changeInfo.status !== "complete") {
    return;
  }

  chrome.tabs
    .sendMessage<PingMessage>(tab.id, {
      payload: null,
      subject: "ping",
      type: "extensionMessage"
    })
    .then((response) => {
      console.log("Received pong from content script:", response);

      chrome.tabs.sendMessage<ScrapeVideoDetailsMessage>(tab.id, {
        type: "extensionMessage",
        subject: "scrapeVideoDetails",
        payload: {
          pageUrl: tab.url
        }
      });
    })
    .catch(() => {
      console.info("Reload page to fetch video details.");
    });
});

chrome.runtime.onMessage.addListener(runtimeHandler);
