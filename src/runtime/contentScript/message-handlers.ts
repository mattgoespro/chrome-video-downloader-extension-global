import { VideoMessage } from "runtime/services/extension/messages";
import { log } from "runtime/services/utils";
import { scrapeVideoDetailsFromPage } from "runtime/services/video-details/scrape";
import { isExtensionMessage } from "shared/message";

export async function contentScriptRuntimeHandler(
  message: VideoMessage,
  port: chrome.runtime.Port
) {
  if (!isExtensionMessage(message)) {
    log({
      message: ["Skipping handling of non-extension message", message],
      type: "warn"
    });
    return;
  }

  switch (message.subject) {
    case "scrapeVideoDetails": {
      try {
        port.postMessage({
          type: "extensionMessage",
          subject: "videoDetailsScraped",
          payload: scrapeVideoDetailsFromPage()
        });
        return;
      } catch (error) {
        port.postMessage({
          type: "extensionMessage",
          subject: "extensionError",
          payload: error
        });
        return;
      }
    }
    default:
      log({
        message: [`Unhandled extension message in content script`, message.subject],
        type: "warn"
      });
  }
}

export function handleScrapeVideoDetailsMessage(): void {}
