import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  href: string;
  imgSrc: string;
  title: string;
  size?: "large" | "small";
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

  return (
    <div
      className={`horizontal-game ${
        isLarge ? "w-full md:w-1/2" : "w-full sm:w-1/2 md:w-1/4"
      } m-[1%] text-center select-none cursor-none`}
    >
      <Link
        href={href}
        target="_blank"
        draggable={false}
        className="no-underline text-[#868686] group block interactable-object"
      >
        {/* Image container */}
        <div className="relative w-full h-[80%]">
          <Image
            src={imgSrc}
            alt={title}
            width={600}
            height={400}
            className="rounded-[10px] w-full h-full object-cover select-none cursor-pointer"
            draggable={false}
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
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <h2 className="mt-[10px] text-[1.5em] text-[#868686] select-none cursor-text">
          {title}
        </h2>
    </div>
  );
}
