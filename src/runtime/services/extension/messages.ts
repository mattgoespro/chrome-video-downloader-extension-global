import { Message, PayloadMessage } from "shared/message";

export type ExtensionErrorMessage = PayloadMessage<"extensionError", { extensionError: Error }>;

type PayloadMap = {
  fetchVideoDetails: null;
  videoDetailsFetched: {
    title: string;
    srcUrl: string;
    thumbnailUrl: string;
  };
  videoDetailsScraped: {
    title: string;
    srcUrl: string;
    thumbnailUrl: string;
  };
  downloadVideo: {
    srcUrl: string;
    fileName: string;
  };
  videoDownloaded: null;
  logMessage: {
    message: string;
    args: unknown[];
  };
};

export type FetchVideoDetailsMessage = PayloadMessage<"fetchVideoDetails", PayloadMap>;

export type VideoDetailsFetchedMessage = PayloadMessage<"videoDetailsFetched", PayloadMap>;

export type VideoDetailsScrapedMessage = PayloadMessage<"videoDetailsScraped", PayloadMap>;

export type DownloadVideoMessage = PayloadMessage<"downloadVideo", PayloadMap>;

export type VideoDownloadedMessage = PayloadMessage<"videoDownloaded", PayloadMap>;

export type LogMessage = PayloadMessage<"logMessage", PayloadMap>;

export type ScrapeVideoDetailsMessage = Message<"scrapeVideoDetails">;

export type VideoMessage =
  | FetchVideoDetailsMessage
  | VideoDetailsFetchedMessage
  | ScrapeVideoDetailsMessage
  | VideoDetailsScrapedMessage
  | DownloadVideoMessage
  | VideoDownloadedMessage
  | LogMessage;
