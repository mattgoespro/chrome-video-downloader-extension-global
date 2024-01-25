import { VideoDetail } from "runtime/services/video-details/model";

export type VideoDetailsProps = {
  details: VideoDetail;
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
