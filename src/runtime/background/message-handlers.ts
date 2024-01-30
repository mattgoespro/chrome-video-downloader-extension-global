import { DownloadVideoMessage, VideoMessage } from "runtime/services/extension/messages";
import { infoLog, warnLog } from "runtime/services/utils";
import { isExtensionMessage } from "shared/message";

export async function backgroundRuntimeHandler(message: VideoMessage, port: chrome.runtime.Port) {
  if (!isExtensionMessage(message)) {
    return true;
  }

  switch (message.subject) {
    case "fetchVideoDetails": {
      try {
        port.postMessage({
          type: "extensionMessage",
          subject: "scrapeVideoDetails"
        });
      } catch (e) {
        console.warn(warnLog("Unable to scrape video details.", e));
        return;
      }
      break;
    }
    case "videoDetailsScraped": {
      console.log(infoLog(["Video details scraped.", message.payload]));
      try {
        port.postMessage({
          type: "extensionMessage",
          subject: "videoDetailsFetched",
          payload: message.payload
        });
      } catch (e) {
        console.log(warnLog("Unable to fetch video details.", e));
        return false;
      }
      break;
    }
    case "downloadVideo": {
      handleDownloadVideoMessage(message);
      break;
    }
    default:
      console.warn(
        warnLog({
          message: [`Unhandled extension message in service worker:`, message.subject],
          type: "warn"
        })
      );
  }

  return true;
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
