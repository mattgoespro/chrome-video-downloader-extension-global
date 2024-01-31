import { useState } from "react";
import { VideoDetail } from "runtime/services/video-details/model";
import { VideoDetails } from "./videoDetails";

export const SidePanel = () => {
  const [videoFileName, setVideoFileName] = useState<string>(undefined);
  const [videoDetails, _setVideoDetails] = useState<VideoDetail>(undefined);

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoFileName(event.target.value);
  };

  const handleDownloadClick = async () => {};

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
