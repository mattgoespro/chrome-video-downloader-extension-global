import { isExtensionMessage } from "message";
import {
  ScrapeVideoDetailsMessage,
  VideoDetailsScrapedMessage,
  VideoMessage
} from "video-downloader/messages";
import { VideoSource, getSupportedWebsiteNameForUrl } from "video-downloader/model";
import { scrapeVideoDetailsFromElements } from "./scrape";

chrome.runtime.onMessage.addListener(async (message: VideoMessage) => {
  if (window.parent === window) {
    console.log("Skipping handling of script message running outside of iframe", message);
    return;
  }

  if (!isExtensionMessage(message)) {
    console.warn("Skipping handling of non-extension message", message);
    return;
  }

  switch (message.subject) {
    case "scrapeVideoDetailsInIframe": {
      try {
        const videoDetails = scrapeVideoDetailsFromPage(
          (message as ScrapeVideoDetailsMessage).payload.pageUrl
        );

        chrome.runtime.sendMessage<VideoDetailsScrapedMessage>({
          type: "extensionMessage",
          subject: "videoDetailsScraped",
          payload: videoDetails
        });
      } catch (error) {
        console.error(error);
        return;
      }

      break;
    }
    default:
      throw new Error(`Unsupported message subject: ${message.subject}`);
  }

  function scrapeVideoDetailsFromPage(webpageUrl: string): VideoSource | undefined {
    const websiteName = getSupportedWebsiteNameForUrl(webpageUrl);
    console.log("Supported website name:", websiteName);
    console.log(document);
    let titleElement: HTMLElement, videoPlayerElement: HTMLElement, thumbnailElement: HTMLElement;

    switch (websiteName) {
      case "pornzog": {
        videoPlayerElement = document.querySelector<HTMLVideoElement>("body .pplayer video");
        titleElement = document.querySelector("body .pplayer .jw-title-primary");
        thumbnailElement = document.querySelector("body .pplayer .jw-preview");
      }
    }

    console.log("Title element:", titleElement);
    console.log("Video player element:", videoPlayerElement);
    console.log("Thumbnail element:", thumbnailElement);

    console.log("Scraping video details from page...");

    return scrapeVideoDetailsFromElements(titleElement, videoPlayerElement, thumbnailElement);
  }
});
