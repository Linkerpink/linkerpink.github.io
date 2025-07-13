import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./theme-context";

interface GameCardProps {
  href: string;
  imgSrc: string;
  title: string;
  size?: "large" | "medium" | "small";
  technologies?: string[];
}

export default function GameCard({
  href,
  imgSrc,
  title,
  size = "small",
  technologies = [],
}: GameCardProps) {
  const isLarge = size === "large";
  const isMedium = size === "medium";
  const { theme } = useTheme();
  const isSecretTheme = theme === "secret";

  return (
    <div
      className={`horizontal-game ${
        isLarge
          ? "w-full md:w-1/2"
          : isMedium
            ? "w-full sm:w-1/2 md:w-1/3"
            : "w-full sm:w-1/2 md:w-1/4"
      } m-[1%] text-center select-none cursor-none`}
      style={isSecretTheme ? {
        background: '#ff16ea',
        color: '#faecb7',
        borderRadius: '75%',
        border: '4px solid #faecb7',
        fontFamily: 'Smooch, cursive, Arial, sans-serif',
      } : {}}
    >
      <Link
        href={href}
        target="_blank"
        draggable={false}
        className="no-underline group block interactable-object"
        style={isSecretTheme ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif' } : {}}
      >
        {/* Image container */}
        <div className="relative w-full h-[80%]">
          <Image
            src={imgSrc}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover select-none cursor-pointer"
            draggable={false}
            style={isSecretTheme ? { borderRadius: '75%' } : { borderRadius: '10px' }}
          />

          {/* Technologies badge */}
          {technologies.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-md px-0.5 py-0.5 flex gap-0.5 items-center shadow">
              {technologies.map((icon, i) => (
                <Image
                  key={i}
                  src={icon}
                  alt="tech"
                  width={30}
                  height={30}
                  className="w-8.5 h-8.5 object-contain"
                  style={isSecretTheme ? { borderRadius: '75%' } : {}}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <h2
        className="mt-[10px] text-[1.5em] select-none cursor-text"
        style={isSecretTheme ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif' } : {}}
      >
        {title}
      </h2>
    </div>
  );
}