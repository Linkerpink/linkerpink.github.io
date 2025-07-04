import Image from 'next/image';

type SkillCardProps = {
  name: string;
  description: string;
  logo: string;
};

export default function SkillCard({ name, description, logo }: SkillCardProps) {
  return (
    <div className="w-full md:w-1/2 p-2">
      <div className="group interactable-object">
        <div className="flex items-center rounded-2xl bg-gradient-to-t from-[#d8d8d8] to-[#ffffff] p-4 shadow-lg cursor-pointer">
          {/* Icon */}
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
            <Image 
              src={logo} 
              alt={name} 
              width={64} 
              height={64} 
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Text */}
          <div className="ml-6 flex flex-col justify-center select-none">
            <h3 className="text-[#868686] text-lg font-semibold">{name}</h3>
            <p className="text-sm text-[#868686]">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
