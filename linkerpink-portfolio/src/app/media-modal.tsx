import React, { useEffect, useCallback } from "react";
import Image from "next/image";

interface MediaModalProps {
  mediaItems: {
    imgSrc?: string;
    gifSrc?: string;
    videoSrc?: string;
    youtubeId?: string;
    title: string;
  }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

const MediaModal: React.FC<MediaModalProps> = ({
  mediaItems,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen || mediaItems.length === 0) {
    return null;
  }

  const currentMedia = mediaItems[currentIndex];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onNavigate("prev");
      } else if (event.key === "ArrowRight") {
        onNavigate("next");
      } else if (event.key === "Escape") {
        onClose();
      }
    },
    [onNavigate, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 text-white text-6xl opacity-75 hover:opacity-100 focus:outline-none z-10"
              onClick={() => onNavigate("prev")}
              style={{
                background: "linear-gradient(to right, #ffffff80, transparent)",
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &#9664;
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 text-white text-6xl opacity-75 hover:opacity-100 focus:outline-none z-10"
              onClick={() => onNavigate("next")}
              style={{
                background: "linear-gradient(to left, #ffffff80, transparent)",
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &#9654;
            </button>
          </>
        )}

        {/* Media Content */}
        <div className="relative w-4/5 h-4/5 flex items-center justify-center">
          {currentMedia.imgSrc && (
            <Image
              src={currentMedia.imgSrc}
              alt={currentMedia.title}
              fill
              style={{ objectFit: "contain" }}
              draggable={false}
            />
          )}
          {currentMedia.gifSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentMedia.gifSrc}
              alt={currentMedia.title}
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          )}
          {currentMedia.videoSrc && (
            <video
              src={currentMedia.videoSrc}
              controls
              className="max-w-full max-h-full object-contain"
            />
          )}
          {currentMedia.youtubeId && (
            <iframe
              src={`https://www.youtube.com/embed/${currentMedia.youtubeId}`}
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>

        {/* Close Button */}
        <button
          className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-75 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
          onClick={onClose}
        >
          <span className="text-xl font-bold">X</span>
          <span>Close</span>
        </button>
      </div>
    </div>
  );
};

export default MediaModal;