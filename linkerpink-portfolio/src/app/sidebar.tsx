// src/app/Sidebar.tsx
import Image from 'next/image';
import Link from 'next/link';

const sidebarItems = [
	{
		href: '/',
		img: '/images/eshop logo.png',
		alt: 'Home Icon',
		label: 'Home',
		selected: true,
	},
	{
		href: '/about-me',
		img: '/images/eng.png',
		alt: 'My Menu Icon',
		label: 'Profile',
	},
	{
		href: 'https://linkerpink.itch.io/',
		img: '/images/itch.io logo.png',
		alt: 'Projects Icon',
		label: 'Projects',
		external: true,
	},
	{
		href: 'https://www.google.com',
		img: '/images/eng.png',
		alt: 'Contact Icon',
		label: 'Contact',
		external: true,
	},
	{
		href: 'https://www.nintendo.com/us/',
		img: '/images/wii u close icon.png',
		alt: 'Close Icon',
		label: 'Close',
		last: true,
		external: true,
	},
];

export default function Sidebar() {
	return (
		<nav className="fixed top-0 left-0 h-full flex flex-col items-center w-[10.5%] bg-transparent z-50">
			{sidebarItems.map((item, idx) => {
				const base =
					'sidebar-item w-full py-4 px-0 bg-[#fafafa] text-center text-2xl transition-colors duration-300 text-[#3f3f3f] shadow-[5px_0px_5px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center flex-1 border-b-2 border-[#dedede] select-none no-underline cursor-default';
				const selected = item.selected ? 'text-[#F57C00]' : '';
				const first = idx === 0 ? 'rounded-tr-[35%]' : '';
				const last = item.last
					? 'rounded-br-[35%] bg-gradient-to-r from-[#545454] to-[#323232] text-[#fafafa] border-b-0'
					: '';
				const hover =
					item.last
						? 'hover:from-[#325c63] hover:to-[#323232]'
						: 'hover:bg-[#CBF8FE]';
				const className = [base, selected, first, last, hover].join(' ');

				const content = (
					<>
						<Image
							src={item.img}
							alt={item.alt}
							width={64}
							height={64}
							className="w-1/4 h-auto mb-3 pointer-events-none"
							draggable={false}
							priority={idx === 0}
						/>
						<span className="mt-1">{item.label}</span>
					</>
				);

				if (item.external) {
					return (
						<a
							key={item.label}
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							draggable={false}
							className={className}
						>
							{content}
						</a>
					);
				}
				return (
					<Link
						key={item.label}
						href={item.href}
						draggable={false}
						className={className}
					>
						{content}
					</Link>
				);
			})}
		</nav>
	);
}