import { VideoMessage } from "runtime/services/extension/messages";
import { errorLog, infoLog, warnLog } from "runtime/services/utils";
import { scrapeVideoDetailsFromPage } from "runtime/services/video-details/scrape";
import { isExtensionMessage } from "shared/message";

export async function contentScriptRuntimeHandler(
  message: VideoMessage,
  port: chrome.runtime.Port
) {
  console.log(infoLog(["Handling message", message]));

  if (!isExtensionMessage(message)) {
    console.log(
      warnLog({
        message: ["Skipping handling of non-extension message", message]
      })
    );
    return true;
  }

  switch (message.subject) {
    case "scrapeVideoDetails": {
      console.log("Scraping video details from page...");

      try {
        port.postMessage({
          type: "extensionMessage",
          subject: "videoDetailsScraped",
          payload: scrapeVideoDetailsFromPage()
        });
        return true;
      } catch (error) {
        console.log(errorLog("Unable to scrape video details.", error));
        port.postMessage({
          type: "extensionMessage",
          subject: "extensionError",
          payload: error
        });
        return false;
      }
    }
    default:
      console.warn(warnLog(["Unhandled extension message in content script:", message.subject]));
  }

  return true;
}

export function handleScrapeVideoDetailsMessage(): void {}
