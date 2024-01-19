import { useState, useEffect } from "react";
import { isExtensionMessage } from "message";
import {
  VideoMessage,
  VideoDetailsFetchedMessage,
  FetchVideoDetailsMessage,
  DownloadVideoMessage
} from "video-downloader/messages";
import { VideoSource } from "video-downloader/model";
import { VideoDetails } from "./videoDetails";

export const SidePanel = () => {
  const [videoFileName, setVideoFileName] = useState<string>(undefined);
  const [videoDetails, setVideoDetails] = useState<VideoSource>(undefined);

  chrome.runtime.onMessage.addListener((message: VideoMessage) => {
    if (!isExtensionMessage(message)) {
      console.log("Skipping handling of non-extension message", message);
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
