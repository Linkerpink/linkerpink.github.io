import Image from 'next/image';

type LinkCardProps = {
  logo: string;
  href: string;
};

export default function LinkCard({ logo, href }: LinkCardProps) {
  return (
    <div className="w-full md:w-1/6 p-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block group interactable-object"
      >
        <div className="flex items-center rounded-[10px] bg-gradient-to-t from-[#d8d8d8] to-[#ffffff] p-4 shadow-lg cursor-pointer">
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src={logo}
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
      </a>
    </div>
  );
}