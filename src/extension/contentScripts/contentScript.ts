import { isExtensionMessage } from "message";
import {
  ScrapeVideoDetailsMessage,
  VideoDetailsScrapedMessage,
  VideoMessage
} from "video-downloader/messages";
import { VideoSource, getSupportedWebsiteNameForUrl } from "video-downloader/model";
import { scrapeVideoDetailsFromElements } from "./scrape";

console.debug("Content script loaded...");

chrome.runtime.onMessage.addListener(async (message: VideoMessage, sender, sendResponse) => {
  if (!isExtensionMessage(message)) {
    console.warn("Skipping handling of non-extension message", message);
    return;
  }

  switch (message.subject) {
    case "ping": {
      console.log("Received ping from background script, responding with pong");
      sendResponse({ type: "extensionMessage", subject: "pong", payload: "pong" });
      break;
    }
    case "scrapeVideoDetails": {
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
    case "scrapeVideoDetailsInIframe": {
      return;
    }
    default:
      throw new Error(`Unsupported message subject: ${message.subject}`);
  }

  function scrapeVideoDetailsFromPage(webpageUrl: string): VideoSource | undefined {
    const websiteName = getSupportedWebsiteNameForUrl(webpageUrl);
    console.log("Supported website name:", websiteName);

    let titleElement: HTMLElement, videoPlayerElement: HTMLElement, thumbnailElement: HTMLElement;

    switch (websiteName) {
      case "reddit": {
        const REDDIT_POST_CONTAINER_SELECTOR = "[data-testid='post-container']";
        titleElement = document.querySelector(
          `${REDDIT_POST_CONTAINER_SELECTOR} [data-adclicklocation='title'] h1`
        );
        videoPlayerElement = document
          .querySelector("shreddit-player")
          ?.shadowRoot?.querySelector("video");
        thumbnailElement = document.querySelector(`${REDDIT_POST_CONTAINER_SELECTOR} [poster]`);
        break;
      }
      case "spankbang": {
        const SPANKBANG_CONTAINER_SELECTOR = "#video div.left";
        titleElement = document.querySelector(`${SPANKBANG_CONTAINER_SELECTOR} h1[title]`);
        videoPlayerElement = document.querySelector(
          `${SPANKBANG_CONTAINER_SELECTOR} #main_video_player video`
        );
        thumbnailElement = document.querySelector(
          `${SPANKBANG_CONTAINER_SELECTOR} img.player_thumb`
        );
        break;
      }
    }

    console.log("Scraping video details from page...");

    return scrapeVideoDetailsFromElements(titleElement, videoPlayerElement, thumbnailElement);
  }
});
