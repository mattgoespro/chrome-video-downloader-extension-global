import { ExtensionError, VideoDetail } from "./extension";

export function scrapeVideoDetailsFromPage(): VideoDetail | undefined {
  try {
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
  } catch (error) {
    if (error instanceof ExtensionError) {
      switch (error.type) {
        case "ScrapeElementError":
          console.warn(
            "Error scraping video details from page.\n",
            error.message,
            error.stack ? `\n${error.stack}` : ""
          );
          break;
        case "VideoDetailError":
          console.warn(
            "Incomplete video details.\n",
            error.message,
            error.stack ? `\n${error.stack}` : ""
          );
          break;
      }
    }
  }
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

  console.info(
    "Scraped video details.",
    "\n\nTitle:",
    title,
    "\nSource URL:",
    srcUrl,
    "\nThumbnail URL:",
    thumbnailUrl
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
