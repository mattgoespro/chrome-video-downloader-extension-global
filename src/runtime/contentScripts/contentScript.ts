import { ExtensionError } from "runtime/services/extension";
import { VideoDetailsScrapedMessage, VideoMessage } from "runtime/services/extension-messages";
import { scrapeVideoDetailsFromPage } from "runtime/services/scrape-video-details";
import { isExtensionMessage } from "shared/message";

console.debug("Content script loaded...");

chrome.runtime.onMessage.addListener(async (message: VideoMessage, sender, sendResponse) => {
  if (!isExtensionMessage(message)) {
    console.warn("Skipping handling of non-extension message", message);
    return;
  }

  switch (message.subject) {
    case "ping": {
      sendResponse({ type: "extensionMessage", subject: "pong", payload: "pong" });
      break;
    }
    case "scrapeVideoDetails": {
      try {
        const videoDetails = scrapeVideoDetailsFromPage();

        const message: VideoDetailsScrapedMessage = {
          type: "extensionMessage",
          subject: "videoDetailsScraped",
          payload: videoDetails
        };

        sendResponse(message);
        return;
      } catch (error) {
        throw new ExtensionError(
          "VideoDetailError",
          {
            title: "title",
            srcUrl: "srcUrl",
            thumbnailUrl: "thumbnailUrl"
          },
          error
        );
      }
    }
    default:
      throw new Error(`Unhandled content script message subject '${message.subject}'.`);
  }
});
