import { Message } from "shared/message";

export type VideoMessagePayloadMap = {
  fetchVideoDetails: null;
  videoDetailsFetched: {
    title: string;
    srcUrl: string;
    thumbnailUrl: string;
  };
  scrapeVideoDetails: {
    pageUrl: string;
  };
  scrapeVideoDetailsInIframe: {
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
  ping: null;
  pong: null;
};

export type VideoMessageType = keyof VideoMessagePayloadMap;

export type VideoMessage = Message<VideoMessagePayloadMap>;

export type FetchVideoDetailsMessage = Message<VideoMessagePayloadMap, "fetchVideoDetails">;

export type VideoDetailsFetchedMessage = Message<VideoMessagePayloadMap, "videoDetailsFetched">;

export type ScrapeVideoDetailsMessage = Message<
  VideoMessagePayloadMap,
  "scrapeVideoDetails" | "scrapeVideoDetailsInIframe"
>;

export type ScrapeVideoDetailsInIframeMessage = Message<
  VideoMessagePayloadMap,
  "scrapeVideoDetailsInIframe"
>;

export type VideoDetailsScrapedMessage = Message<VideoMessagePayloadMap, "videoDetailsScraped">;

export type DownloadVideoMessage = Message<VideoMessagePayloadMap, "downloadVideo">;

export type VideoDownloadedMessage = Message<VideoMessagePayloadMap, "videoDownloaded">;

export type LogMessage = Message<VideoMessagePayloadMap, "logMessage">;

export type PingMessage = Message<VideoMessagePayloadMap, "ping">;

export type PongMessage = Message<VideoMessagePayloadMap, "pong">;

export type VideoMessages =
  | ScrapeVideoDetailsMessage
  | DownloadVideoMessage
  | FetchVideoDetailsMessage
  | LogMessage;
