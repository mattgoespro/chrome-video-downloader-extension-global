import { VideoDetail } from "runtime/services/extension";
import { PingMessage, ScrapeVideoDetailsMessage } from "runtime/services/extension-messages";
import { log } from "runtime/services/log";
import { scrapeVideoDetailsFromPage } from "runtime/services/scrape-video-details";
import { runtimeHandler } from "./handlers";

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) =>
  log({
    type: "fatal",
    message: ["Unable to set side panel behavior."],
    error
  })
);

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

  try {
    chrome.tabs
      .sendMessage<PingMessage>(tab.id, {
        payload: null,
        subject: "ping",
        type: "extensionMessage"
      })
      .then(() => {
        log("Service worker synchronized with content script...");

        chrome.tabs.sendMessage<ScrapeVideoDetailsMessage>(tab.id, {
          type: "extensionMessage",
          subject: "scrapeVideoDetails",
          payload: {
            pageUrl: tab.url
          }
        });
      })
      .catch((error) => {
        log({
          type: "fatal",
          message: "Unable to synchronize service worker with content script.",
          error
        });
      });
  } catch (error) {
    log({
      type: "fatal",
      message: "Unable to synchronize service worker with content script.",
      error
    });
  }
});

chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameType === "sub_frame" && details.url.includes("embed")) {
    const executeScriptPromise = new Promise<VideoDetail | undefined>((resolve, reject) => {
      chrome.scripting
        .executeScript({
          target: { tabId: details.tabId, frameIds: [details.frameId] },
          func: scrapeVideoDetailsFromPage
        })
        .then(([injectionResult]) => {
          resolve(injectionResult.result);
        })
        .catch(reject);
    });

    const videoDetails = await executeScriptPromise;
    log({
      type: "info",
      message: [`Video details scraped from page:`, videoDetails]
    });
  }
});

chrome.runtime.onMessage.addListener(runtimeHandler);
