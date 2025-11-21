"use client";

import { useState, useRef, useEffect } from "react";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Autoplay was prevented, show play button
        console.log("Autoplay prevented:", error);
        setShowPlayButton(true);
      });
    }
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayButton(true);
    }
  };

  // You can replace this with your actual video URL or path
  const videoSrc = "/assets/videos/store-video.mp4"; // Update with your video path
  const thumbnailSrc = "/assets/images/video-thumbnail.jpg"; // Optional thumbnail image

  return (
    <section className="w-full pb-8 md:pb-12 lg:pb-15 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls={isPlaying}
            onPause={handlePause}
            onPlay={() => {
              setIsPlaying(true);
              setShowPlayButton(false);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setShowPlayButton(true);
            }}
            poster={thumbnailSrc}
          >
            <source
              src={videoSrc}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Play Button Overlay */}
          {showPlayButton && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transition-opacity duration-300 hover:bg-opacity-40"
              onClick={handlePlay}
            >
              <div className="relative">
                {/* Outer Circle */}
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110">
                  {/* Play Icon */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#1D1D1D] ml-1"
                  >
                    <path
                      d="M8 5V19L19 12L8 5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
