import Image from 'next/image';
import { useTheme } from './theme-context';
type LinkCardProps = {
  logo: string;
  href: string;
};

export default function LinkCard({ logo, href }: LinkCardProps) {
  const { theme } = useTheme();
  const isSecretTheme = theme === 'secret';
  const isDarkTheme = theme === 'dark';
  let gradientClass = '';
  if (!isSecretTheme) {
    gradientClass = isDarkTheme ? 'card-gradient-dark' : 'card-gradient-light';
  }
  return (
    <div className="w-full md:w-1/6 p-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block group interactable-object"
        style={isSecretTheme ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif' } : {}}
      >
        <div
          className={`flex items-center p-4 shadow-lg cursor-pointer ${gradientClass}`}
          style={isSecretTheme ? {
            borderRadius: '75%',
            background: '#ff16ea',
            color: '#faecb7',
            fontFamily: 'Smooch, cursive, Arial, sans-serif',
            border: '4px solid #faecb7',
          } : { borderRadius: '10px' }}
        >
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src={logo}
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-contain select-none"
              draggable={false}
              style={isSecretTheme ? { borderRadius: '75%' } : {}}
            />
          </div>
        </div>
      </a>
    </div>
  );
}