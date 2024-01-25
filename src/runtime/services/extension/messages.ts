import { Message, PayloadMessage } from "shared/message";

type PayloadMap = {
  fetchVideoDetails: null;
  videoDetailsFetched: {
    title: string;
    srcUrl: string;
    thumbnailUrl: string;
  };
  scrapeVideoDetails: {
    pageUrl: string;
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

export type ScrapeVideoDetailsMessage = PayloadMessage<"scrapeVideoDetails", PayloadMap>;

export type VideoDetailsScrapedMessage = PayloadMessage<"videoDetailsScraped", PayloadMap>;

export type DownloadVideoMessage = PayloadMessage<"downloadVideo", PayloadMap>;

export type VideoDownloadedMessage = PayloadMessage<"videoDownloaded", PayloadMap>;

export type LogMessage = PayloadMessage<"logMessage", PayloadMap>;

export type ScriptSyncMessage = Message<"sync">;

export type ScriptSyncCompletedMessage = Message<"syncComplete">;

export type VideoMessage =
  | FetchVideoDetailsMessage
  | VideoDetailsFetchedMessage
  | ScrapeVideoDetailsMessage
  | VideoDetailsScrapedMessage
  | DownloadVideoMessage
  | VideoDownloadedMessage
  | ScriptSyncMessage
  | ScriptSyncCompletedMessage
  | LogMessage;
