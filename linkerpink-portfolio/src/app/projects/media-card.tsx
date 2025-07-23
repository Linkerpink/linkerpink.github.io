import Image from "next/image";
import { useTheme } from "../theme-context";
import Link from "next/link";

interface MediaCardProps {
  href?: string;
  imgSrc?: string;
  videoSrc?: string;      // regular video file
  gifSrc?: string;        // animated gif
  youtubeId?: string;     // YouTube embed
  title: string;
  size?: "large" | "medium" | "small";
}

const MediaCard: React.FC<MediaCardProps> = ({
  title,
  imgSrc,
  videoSrc,
  gifSrc,
  youtubeId,
  size = "small",
  href,
}) => {
  const isLarge = size === "large";
  const isMedium = size === "medium";
  const { theme } = useTheme();
  const isSecretTheme = theme === "secret";

  const wrapperClass = `horizontal-game ${
    isLarge
      ? "w-full md:w-1/2"
      : isMedium
      ? "w-full sm:w-1/2 md:w-1/3"
      : "w-full sm:w-1/2 md:w-1/4"
  } m-[1%] text-center select-none`;

  const secretStyle = isSecretTheme
    ? {
        background: "radial-gradient(circle at center, #bb00ff, #6aff00)",
        color: "#faecb7",
        borderRadius: "75%",
        border: "4px solid #faecb7",
        fontFamily: "Smooch, cursive, Arial, sans-serif",
      }
    : {};

  // Decide which type of media is shown
  const isVideo = !!videoSrc;
  const isGif = !!gifSrc;
  const isYouTube = !!youtubeId;

  const mediaTypeIcon = isVideo
    ? "🎥"
    : isGif
    ? "🌀"
    : youtubeId
    ? "▶️"
    : imgSrc
    ? "🔍"
    : null;

  const showTitle = isVideo || isYouTube || isGif;

  const media = (
    <>
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover select-none cursor-pointer"
            draggable={false}
            style={isSecretTheme ? { borderRadius: "75%" } : { borderRadius: "10px" }}
          />
        )}

        {videoSrc && (
          <video
            src={videoSrc}
            controls
            className="absolute inset-0 w-full h-full object-cover"
            style={isSecretTheme ? { borderRadius: "75%" } : { borderRadius: "10px" }}
          />
        )}

        {gifSrc && (
          <Image
            src={gifSrc}
            alt={title}
            fill
            className="object-cover select-none"
            style={isSecretTheme ? { borderRadius: "75%" } : { borderRadius: "10px" }}
          />
        )}

        {youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={isSecretTheme ? { borderRadius: "75%" } : { borderRadius: "10px" }}
          />
        )}

        {/* Media Type Icon */}
        {mediaTypeIcon && (
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-md px-0.5 py-0.5 flex items-center justify-center shadow w-8 h-8 text-lg">
            <span className="leading-none">{mediaTypeIcon}</span>
          </div>
        )}
      </div>

      {/* Only show title for video/gif/youtube */}
      {showTitle && (
        <h2
          className="mt-[10px] text-[1.5em] select-none cursor-text"
          style={
            isSecretTheme
              ? {
                  color: "#faecb7",
                  fontFamily: "Smooch, cursive, Arial, sans-serif",
                }
              : {}
          }
        >
          {title}
        </h2>
      )}
    </>
  );

  const commonProps = {
    className: "no-underline group block interactable-object",
    style: isSecretTheme
      ? { color: "#faecb7", fontFamily: "Smooch, cursive, Arial, sans-serif" }
      : {},
  };

  return (
    <div className={wrapperClass} style={secretStyle}>
      {href ? (
        <Link href={href} draggable={false} {...commonProps}>
          {media}
        </Link>
      ) : (
        <div draggable={false} {...commonProps}>
          {media}
        </div>
      )}
    </div>
  );
};

export default MediaCard;
