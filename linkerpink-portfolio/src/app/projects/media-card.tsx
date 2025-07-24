// components/MediaCard.tsx
import Image from "next/image";
import { useTheme } from "../theme-context";

interface MediaCardProps {
  title: string;
  size?: "large" | "medium" | "small";
  imgSrc?: string;
  gifSrc?: string;
  videoSrc?: string;
  youtubeId?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  title,
  size = "small",
  imgSrc,
  gifSrc,
  videoSrc,
  youtubeId,
}) => {
  const isLarge = size === "large";
  const isMedium = size === "medium";
  const { theme } = useTheme();
  const isSecretTheme = theme === "secret";

  const widthClass = isLarge
    ? "w-full md:w-1/2"
    : isMedium
    ? "w-full sm:w-1/2 md:w-1/3"
    : "w-full sm:w-1/2 md:w-1/4";

  let iconSrc: string | null = null;
  if (imgSrc || gifSrc) iconSrc = "/images/zoom icon.webp";
  else if (videoSrc) iconSrc = "/images/video icon.webp";

  return (
    <div
      className={`horizontal-game ${widthClass} m-[1%] text-center select-none`}
      style={
        isSecretTheme
          ? {
              background: "radial-gradient(circle at center, #bb00ff, #6aff00)",
              color: "#faecb7",
              borderRadius: "75%",
              border: "4px solid #faecb7",
              fontFamily: "Smooch, cursive, Arial, sans-serif",
            }
          : {}
      }
    >
      <div
        className="relative aspect-[16/9] w-full rounded-lg overflow-hidden interactable-object hover:cursor-pointer"
        style={isSecretTheme ? { borderRadius: "75%" } : { borderRadius: "10px" }}
      >
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover"
            draggable={false}
            style={isSecretTheme ? { borderRadius: "75%" } : {}}
          />
        )}

        {gifSrc && (
          <Image
            src={gifSrc}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover"
            draggable={false}
            style={isSecretTheme ? { borderRadius: "75%" } : {}}
          />
        )}

        {videoSrc && (
          <video
            src={videoSrc}
            controls
            className="w-full h-full object-cover"
            style={isSecretTheme ? { borderRadius: "75%" } : {}}
          />
        )}

        {youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            allowFullScreen
            className="w-full h-full object-cover"
            style={isSecretTheme ? { borderRadius: "75%" } : {}}
          />
        )}

        {iconSrc && (
          <div className="absolute bottom-0 right-0 rounded-md items-center w-12 h-12">
            <Image
              src={iconSrc}
              alt="media type"
              fill
              className="object-bottom-right object-contain"
            />
          </div>
        )}
      </div>

      {/* Only show title for video and YouTube */}
      {(videoSrc || youtubeId) && (
        <div
          className="mt-2 font-semibold"
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
        </div>
      )}
    </div>
  );
};

export default MediaCard;
