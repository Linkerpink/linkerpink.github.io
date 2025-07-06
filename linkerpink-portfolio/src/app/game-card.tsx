import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  href: string;
  imgSrc: string;
  title: string;
  size?: "large" | "small";
}

export default function GameCard({ href, imgSrc, title, size = "small" }: GameCardProps) {
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
        className="no-underline text-[#868686] group block"
      >
        <Image
          src={imgSrc}
          alt={title}
          width={600}
          height={400}
          className="interactable-object w-full h-[80%] select-none cursor-pointer"
          draggable={false}
        />
        <h2 className="mt-[10px] text-[1.5em] text-[#868686] select-none cursor-text">
          {title}
        </h2>
      </Link>
    </div>
  );
}
