import { ExtensionError } from "runtime/services/extension/errors";
import {
  ScriptSyncCompletedMessage,
  VideoDetailsScrapedMessage,
  VideoMessage
} from "runtime/services/extension/messages";
import { log } from "runtime/services/utils";
import { scrapeVideoDetailsFromPage } from "runtime/services/video-details/scrape";
import { isExtensionMessage } from "shared/message";

export async function contentScriptRuntimeHandler(message: VideoMessage, sender, sendResponse) {
  if (!isExtensionMessage(message)) {
    log({
      message: ["Skipping handling of non-extension message", message],
      type: "warn"
    });
    return;
  }

  switch (message.subject) {
    case "sync": {
      handleSyncMessage(sendResponse);
      break;
    }
    case "scrapeVideoDetails": {
      handleScrapeVideoDetailsMessage(sendResponse);
      break;
    }
    default:
      log({
        message: [`Unhandled extension message in content script`, message.subject],
        type: "warn"
      });
  }
}

export function handleSyncMessage(
  sendResponse: (response: ScriptSyncCompletedMessage) => void
): void {
  sendResponse({ type: "extensionMessage", subject: "syncComplete" });
}

export function handleScrapeVideoDetailsMessage(
  sendResponse: (response: VideoDetailsScrapedMessage | ExtensionError<"VideoDetailError">) => void
): void {
  try {
    const videoDetails = scrapeVideoDetailsFromPage();

    sendResponse({
      type: "extensionMessage",
      subject: "videoDetailsScraped",
      payload: videoDetails
    });
    return;
  } catch (error) {
    sendResponse(
      new ExtensionError(
        "VideoDetailError",
        {
          title: "title",
          srcUrl: "srcUrl",
          thumbnailUrl: "thumbnailUrl"
        },
        error
      )
    );
  }
}
