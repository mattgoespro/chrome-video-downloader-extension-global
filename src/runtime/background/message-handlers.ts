import {
  DownloadVideoMessage,
  ScrapeVideoDetailsMessage,
  VideoDetailsFetchedMessage,
  VideoDetailsScrapedMessage,
  VideoMessage
} from "runtime/services/extension/messages";
import { log, messageContentScript } from "runtime/services/utils";
import { scrapeVideoDetailsFromPage } from "runtime/services/video-details/scrape";
import { isExtensionMessage } from "shared/message";

export async function backgroundRuntimeHandler(message: VideoMessage): Promise<void> {
  if (!isExtensionMessage(message)) {
    return;
  }

  switch (message.subject) {
    case "fetchVideoDetails": {
      handleFetchVideoDetailsMessage();
      break;
    }
    case "videoDetailsScraped": {
      handleVideoDetailsScrapedMessage(message);
      break;
    }
    case "downloadVideo": {
      handleDownloadVideoMessage(message);
      break;
    }
    default:
      log({
        message: [`Unhandled extension message in service worker:`, message.subject],
        type: "warn"
      });
  }
}

function handleFetchVideoDetailsMessage(): void {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    chrome.tabs.sendMessage<ScrapeVideoDetailsMessage>(tabs[0].id, {
      type: "extensionMessage",
      subject: "scrapeVideoDetails",
      payload: { pageUrl: tabs[0].url }
    });
  });
}

async function handleDownloadVideoMessage(message: DownloadVideoMessage): Promise<void> {
  const { srcUrl, fileName } = message.payload;

  if (srcUrl.startsWith("blob:")) {
    const blob = await fetch(message.payload.srcUrl).then((r) => r.blob());
    const blobUrl = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: blobUrl,
      filename: `${fileName}.mp4`
    });
    return;
  }

  chrome.downloads.download({
    url: srcUrl,
    filename: `${fileName}.mp4`
  });
}

async function handleVideoDetailsScrapedMessage(
  message: VideoDetailsScrapedMessage
): Promise<void> {
  const { payload } = message;

  chrome.runtime.sendMessage<VideoDetailsFetchedMessage>({
    type: "extensionMessage",
    subject: "videoDetailsFetched",
    payload
  });
}

export async function handleWebNavigationMessage(
  details: chrome.webNavigation.WebNavigationFramedCallbackDetails
): Promise<void> {
  if (details.frameType === "sub_frame" && details.url.includes("embed")) {
    console.log("Scraping video details from page...");
    return new Promise<void>((resolve, reject) => {
      const target = { tabId: details.tabId, frameIds: [details.frameId] };

      chrome.scripting
        .executeScript({
          target,
          func: scrapeVideoDetailsFromPage
        })
        .then(([injectionResult]) => {
          const videoDetails = injectionResult.result;

          log({
            type: "info",
            message: [`Video details scraped from page:`, videoDetails]
          });

          chrome.runtime.sendMessage<VideoDetailsScrapedMessage>({
            type: "extensionMessage",
            subject: "videoDetailsScraped",
            payload: videoDetails
          });
          resolve();
        })
        .catch((error) => {
          log({
            type: "warn",
            message: "Unable to inject script into page.",
            error
          });
          reject(error);
        });
    });
  }
}

export async function handleTabUpdatedMessage(
  _: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
): Promise<void> {
  if (changeInfo.status !== "complete") {
    log({
      message: ["Waiting for tab to load..."]
    });
    return;
  }

  try {
    messageContentScript<ScrapeVideoDetailsMessage, VideoDetailsScrapedMessage>(
      {
        type: "extensionMessage",
        subject: "scrapeVideoDetails",
        payload: {
          pageUrl: tab.url
        }
      },
      tab.id
    )
      .then((response) => {
        chrome.runtime.sendMessage<VideoDetailsFetchedMessage>({
          type: "extensionMessage",
          subject: "videoDetailsFetched",
          payload: response.payload
        });
      })
      .catch((error) => {
        log({
          type: "warn",
          message: "Unable to synchronize service worker with content script.",
          error
        });
      });
  } catch (error) {
    log({
      type: "warn",
      message: "Unable to synchronize service worker with content script.",
      error
    });
  }
}
