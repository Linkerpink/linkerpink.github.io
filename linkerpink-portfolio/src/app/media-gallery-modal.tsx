"use client";

import React, { useEffect, useState, useCallback } from "react";

export type MediaItem = {
  type: "image" | "video" | "gif" | "youtubeId";
  src: string;
  title?: string;
};

type MediaGalleryModalProps = {
  mediaItems: MediaItem[];
  initialIndex: number;
  onClose: () => void;
};

export default function MediaGalleryModal({
  mediaItems,
  initialIndex,
  onClose,
}: MediaGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? mediaItems.length - 1 : i - 1));
  }, [mediaItems.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i === mediaItems.length - 1 ? 0 : i + 1));
  }, [mediaItems.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    },
    [onClose, prev, next]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!mediaItems.length) return null;

  const currentItem = mediaItems[currentIndex];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-3xl font-bold z-50"
          aria-label="Close modal"
        >
          &times;
        </button>

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold z-50"
          aria-label="Previous media"
        >
          &#8592;
        </button>

        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold z-50"
          aria-label="Next media"
        >
          &#8594;
        </button>

        <div className="max-w-full max-h-full">
          {currentItem.type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentItem.src}
              alt={currentItem.title || "Media image"}
              className="max-w-full max-h-[80vh] object-contain"
            />
          )}
          {(currentItem.type === "video" || currentItem.type === "gif") && (
            <video
              src={currentItem.src}
              controls
              autoPlay={currentItem.type === "gif"}
              loop={currentItem.type === "gif"}
              muted={currentItem.type === "gif"}
              className="max-w-full max-h-[80vh]"
            />
          )}
          {currentItem.type === "youtubeId" && (
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${currentItem.src}?autoplay=1&controls=1`}
              title={currentItem.title || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="max-w-full max-h-[80vh]"
            />
          )}
        </div>

        {currentItem.title && (
          <p className="mt-2 text-white text-center">{currentItem.title}</p>
        )}
      </div>
    </div>
  );
}
