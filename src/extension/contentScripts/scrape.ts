import { ExtensionError, VideoSource, getSupportedWebsiteNameForUrl } from "video-downloader/model";

export function shouldScrapeVideoDetailsInIframe(webpageUrl: string): boolean {
  const websiteName = getSupportedWebsiteNameForUrl(webpageUrl);

  switch (websiteName) {
    case "pornzog":
      return true;
    default:
      return false;
  }
}

export function scrapeVideoDetailsFromElements(
  titleElement: Element,
  videoPlayerElement: Element,
  thumbnailElement: Element
): VideoSource {
  if (!titleElement || !videoPlayerElement || !thumbnailElement) {
    throw new ExtensionError("ScrapeElementError", {
      titleElement,
      videoPlayerElement,
      thumbnailElement
    });
  }

  const title = scrapeTitle(titleElement);
  const srcUrl = scrapeVideoSrcUrl(videoPlayerElement);
  const thumbnailUrl = scrapeThumbnailUrl(thumbnailElement);

  console.log("Scraped video details:", { title, srcUrl, thumbnailUrl });

  if (!title || !srcUrl || !thumbnailUrl) {
    throw new ExtensionError("VideoDetailError", {
      title,
      srcUrl,
      thumbnailUrl
    });
  }

  return { title, srcUrl, thumbnailUrl };
}

function scrapeTitle(titleElement: Element): string {
  if (titleElement.getAttribute("title")) return titleElement.getAttribute("title");

  return titleElement.textContent;
}

function scrapeVideoSrcUrl(videoPlayerElement: Element): string | undefined {
  if (videoPlayerElement.getAttribute("src")) return videoPlayerElement.getAttribute("src");

  return videoPlayerElement?.querySelector("source")?.getAttribute("src");
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
