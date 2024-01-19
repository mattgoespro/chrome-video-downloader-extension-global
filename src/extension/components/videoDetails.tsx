import { VideoSource } from "video-downloader/model";

export type VideoDetailsProps = {
  details: VideoSource;
};

export const VideoDetails = ({ details }: VideoDetailsProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <img src={details?.thumbnailUrl} />
      <video controls>
        <source type="video/mp4" src={details?.srcUrl}></source>
      </video>
      <span>{details.title}</span>
    </div>
  );
};
