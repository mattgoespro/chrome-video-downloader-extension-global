import { isExtensionMessage } from "message";
import {
  VideoMessage,
  ScrapeVideoDetailsMessage,
  VideoDetailsScrapedMessage,
  VideoDetailsFetchedMessage,
  DownloadVideoMessage
} from "video-downloader/messages";

export async function runtimeHandler(message: VideoMessage): Promise<void> {
  if (!isExtensionMessage(message)) {
    console.warn("Listener intercepted an unexpected message:", message);
    return;
  }

  switch (message.subject) {
    case "fetchVideoDetails": {
      handleFetchVideoDetails();
      break;
    }
    case "videoDetailsScraped": {
      handleVideoDetailsScraped(message as VideoDetailsScrapedMessage);
      break;
    }
    case "downloadVideo": {
      handleDownloadVideo(message as DownloadVideoMessage);
      break;
    }
    default:
      throw new Error(`Unexpected message subject: ${message.subject}`);
  }
}

function handleFetchVideoDetails(): void {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    chrome.tabs.sendMessage<ScrapeVideoDetailsMessage>(tabs[0].id, {
      type: "extensionMessage",
      subject: "scrapeVideoDetails",
      payload: { pageUrl: tabs[0].url }
    });
  });
}

async function handleDownloadVideo(message: DownloadVideoMessage): Promise<void> {
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

async function handleVideoDetailsScraped(message: VideoDetailsScrapedMessage): Promise<void> {
  const { payload } = message;

  chrome.runtime.sendMessage<VideoDetailsFetchedMessage>({
    type: "extensionMessage",
    subject: "videoDetailsFetched",
    payload
  });
}
