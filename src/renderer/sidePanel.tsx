import { useState, useEffect } from "react";
import {
  VideoMessage,
  VideoDetailsFetchedMessage,
  FetchVideoDetailsMessage,
  DownloadVideoMessage
} from "runtime/services/extension/messages";
import { log } from "runtime/services/utils";
import { VideoDetail } from "runtime/services/video-details/model";
import { isExtensionMessage } from "shared/message";
import { VideoDetails } from "./videoDetails";

export const SidePanel = () => {
  const [videoFileName, setVideoFileName] = useState<string>(undefined);
  const [videoDetails, setVideoDetails] = useState<VideoDetail>(undefined);

  chrome.runtime.onMessage.addListener((message: VideoMessage) => {
    if (!isExtensionMessage(message)) {
      log("Skipping handling of non-extension message...");
      return;
    }

    if (message.subject === "videoDetailsFetched") {
      setVideoDetails((message as VideoDetailsFetchedMessage).payload);
    }
  });

  useEffect(() => {
    chrome.runtime.sendMessage<FetchVideoDetailsMessage>({
      type: "extensionMessage",
      subject: "fetchVideoDetails",
      payload: null
    });
  }, []);

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoFileName(event.target.value);
  };

  const handleDownloadClick = async () => {
    chrome.runtime.sendMessage<DownloadVideoMessage>({
      type: "extensionMessage",
      subject: "downloadVideo",
      payload: {
        srcUrl: videoDetails.srcUrl,
        fileName: videoFileName ?? videoDetails.title
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {(videoDetails && (
        <>
          <VideoDetails details={videoDetails} />
          <input
            type="text"
            value={videoFileName}
            onChange={handleFileNameChange}
            style={{ width: "70%" }}
          />
          <button onClick={handleDownloadClick}>Download</button>
        </>
      )) || <span>No video found on page.</span>}
    </div>
  );
};
