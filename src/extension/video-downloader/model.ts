export type SupportedWebsite = "reddit" | "spankbang" | "pornzog";

export type VideoSource = {
  title: string;
  srcUrl: string;
  thumbnailUrl: string;
};

export type VideoMediaRequestStorage = {
  mediaRequests: chrome.webRequest.WebResponseCacheDetails[];
  imageRequests: chrome.webRequest.WebResponseCacheDetails[];
};

export type ExtensionErrorType = "ScrapeElementError" | "VideoDetailError" | "UnsupportedError";

export type ExtensionErrorDetails = {
  ScrapeElementError: {
    titleElement: Element;
    videoPlayerElement: Element;
    thumbnailElement: Element;
  };
  VideoDetailError: {
    title: string;
    srcUrl: string;
    thumbnailUrl: string;
  };
  UnsupportedError: {
    webpageUrl: string;
  };
};

export type ExtensionErrorDetail<Type extends ExtensionErrorType> = ExtensionErrorDetails[Type];

export class ExtensionError<
  Type extends "ScrapeElementError" | "VideoDetailError" | "UnsupportedError"
> extends Error {
  constructor(
    type: Type,
    private details: ExtensionErrorDetail<Type>
  ) {
    super();
    this.message = this.getErrorMessage(type);
  }

  private getErrorMessage(type: Type): string {
    const scrapeErrorDetails = [];

    switch (type) {
      case "ScrapeElementError": {
        scrapeErrorDetails.push(
          ...this.getElementErrorMessage(this.details as ExtensionErrorDetail<"ScrapeElementError">)
        );
        break;
      }
      case "VideoDetailError":
        scrapeErrorDetails.push(
          ...this.getDetailErrorMessage(this.details as ExtensionErrorDetail<"VideoDetailError">)
        );
        break;
      case "UnsupportedError":
        scrapeErrorDetails.push(
          ...this.getUnsupportedErrorMessage(
            this.details as ExtensionErrorDetail<"UnsupportedError">
          )
        );
        break;
    }

    return scrapeErrorDetails.join("\n");
  }

  public getUnsupportedErrorMessage(details: ExtensionErrorDetail<"UnsupportedError">): string[] {
    return [`Unsupported webpage URL: ${details.webpageUrl}`];
  }

  private getElementErrorMessage(details: ExtensionErrorDetail<"ScrapeElementError">): string[] {
    const { titleElement, videoPlayerElement, thumbnailElement } = details;
    const elementErrorMessages = [];
    if (!titleElement) elementErrorMessages.push("Title element not found");
    if (!videoPlayerElement) elementErrorMessages.push("Video player element not found");
    if (!thumbnailElement) elementErrorMessages.push("Thumbnail element not found");
    return elementErrorMessages;
  }

  private getDetailErrorMessage(details: ExtensionErrorDetail<"VideoDetailError">): string[] {
    const { title, srcUrl, thumbnailUrl } = details;
    const detailErrorMessages = [];
    if (!title) detailErrorMessages.push("Title not found");
    if (!srcUrl) detailErrorMessages.push("Video URL not found");
    if (!thumbnailUrl) detailErrorMessages.push("Thumbnail URL not found");
    return detailErrorMessages;
  }
}

export function getSupportedWebsiteNameForUrl(webpageUrl: string): SupportedWebsite {
  console.debug("Getting supported website name for URL:", webpageUrl);

  if (webpageUrl.includes("reddit")) {
    return "reddit";
  } else if (webpageUrl.includes("spankbang")) {
    return "spankbang";
  } else if (webpageUrl.includes("pornzog")) {
    return "pornzog";
  } else {
    throw new ExtensionError("UnsupportedError", {
      webpageUrl
    });
  }
}
