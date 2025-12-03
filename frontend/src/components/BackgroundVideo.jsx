import React from "react";
import "./BackgroundVideo.css";

function BackgroundVideo() {
  return (
    <video autoPlay loop muted playsInline className="background-video">
      <source src="/bg-animation.mp4" type="video/mp4" />
    </video>
  );
}

export default BackgroundVideo;
