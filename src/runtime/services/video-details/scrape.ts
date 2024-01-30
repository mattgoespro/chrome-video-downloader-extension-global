import { ExtensionError } from "../extension/errors";
import { ExtensionErrorMessage, VideoMessage } from "../extension/messages";
import { infoLog } from "../utils";
import { VideoDetail } from "./model";

export function scrapeVideoDetailsFromPage(): VideoDetail | undefined {
  const titleElement = getTitleElement();
  const thumbnailElement = getThumbnailElement();
  const videoPlayerElement = getVideoElement();

  if (!titleElement || !videoPlayerElement || !thumbnailElement) {
    throw new ExtensionError("ScrapeElementError", {
      titleElement,
      videoPlayerElement,
      thumbnailElement
    });
  }

  return scrapeVideoDetailsFromElements(titleElement, videoPlayerElement, thumbnailElement);
}

function scrapeVideoDetailsFromElements(
  titleElement: Element,
  videoPlayerElement: Element,
  thumbnailElement: Element
): VideoDetail {
  const title = scrapeTitle(titleElement);
  const srcUrl = scrapeVideoUrl(videoPlayerElement);
  const thumbnailUrl = scrapeThumbnailUrl(thumbnailElement);
  const details: VideoDetail = { title, srcUrl, thumbnailUrl };

  console.log(
    infoLog([
      "Scraped video details.",
      "\n\nTitle:",
      title,
      "\nSource URL:",
      srcUrl,
      "\nThumbnail URL:",
      thumbnailUrl
    ])
  );

  if (!title || !srcUrl || !thumbnailUrl) {
    throw new ExtensionError("VideoDetailError", {
      title,
      srcUrl,
      thumbnailUrl
    });
  }

  return details;
}

function getTitleElement(): HTMLElement {
  const titleElement = document.querySelector<HTMLHeadingElement>(`h1`);
  return titleElement;
}

function scrapeTitle(titleElement: Element): string {
  return titleElement?.textContent;
}

function getVideoElement(): HTMLVideoElement {
  const videoElement = document.querySelector<HTMLVideoElement>(`video`);
  return videoElement;
}

function scrapeVideoUrl(videoPlayerElement: Element): string | undefined {
  if (videoPlayerElement?.getAttribute("src")) return videoPlayerElement.getAttribute("src");

  return videoPlayerElement?.querySelector("source")?.getAttribute("src");
}

function getThumbnailElement(): HTMLElement {
  const thumbnailElement = document.querySelector<HTMLImageElement>(`img`);
  return thumbnailElement;
}

function scrapeThumbnailUrl(thumbnailElement: Element): string {
  switch (thumbnailElement.tagName) {
    case "IMG":
      return thumbnailElement.getAttribute("src");
    case "DIV": {
      const backgroundImage = window.getComputedStyle(thumbnailElement).backgroundImage;
      return backgroundImage.match(/url\("(.*)"\)/)[1];
    }
    default:
      return thumbnailElement.getAttribute("poster");
  }
}
export type SendResponseFn = <M extends VideoMessage | ExtensionErrorMessage>(
  responseMessage: M
) => void;
