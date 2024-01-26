export type ExtensionErrorType = "ScrapeElementError" | "VideoDetailError";

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
};

export type ExtensionErrorDetail<Type extends ExtensionErrorType> = ExtensionErrorDetails[Type];

export class ExtensionError<Type extends ExtensionErrorType> extends Error {
  constructor(
    public type: Type,
    private details: ExtensionErrorDetail<Type>,
    public cause?: Error
  ) {
    super();
    this.message = this.getErrorMessage(type);
    this.stack = this.cause?.stack;
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
      default:
        return "Unknown extension error";
    }

    return scrapeErrorDetails.join("\n");
  }

  private getElementErrorMessage(details: ExtensionErrorDetail<"ScrapeElementError">): string[] {
    const { titleElement, videoPlayerElement, thumbnailElement } = details;
    const elementErrorMessages: string[] = [];

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
