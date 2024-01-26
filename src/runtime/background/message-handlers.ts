import { DownloadVideoMessage, VideoMessage } from "runtime/services/extension/messages";
import { log } from "runtime/services/utils";
import { isExtensionMessage } from "shared/message";

export async function backgroundRuntimeHandler(
  message: VideoMessage,
  port: chrome.runtime.Port
): Promise<void> {
  if (!isExtensionMessage(message)) {
    return;
  }

  switch (message.subject) {
    case "fetchVideoDetails": {
      try {
        port.postMessage({
          type: "extensionMessage",
          subject: "scrapeVideoDetails"
        });
      } catch (e) {
        log({
          message: ["Unable to scrape video details.", e],
          type: "warn"
        });
        return;
      }
      break;
    }
    case "videoDetailsScraped": {
      try {
        port.postMessage({
          type: "extensionMessage",
          subject: "videoDetailsFetched",
          payload: message.payload
        });
      } catch (e) {
        log({
          message: ["Unable to fetch video details.", e],
          type: "warn"
        });
        return;
      }
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
