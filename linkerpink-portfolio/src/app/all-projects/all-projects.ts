// Helper to format date as 'Month Year' or 'Not Released'
function formatDisplayDate(date: string): string {
  if (date.toLowerCase() === 'not released') return 'Not Released';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
}

// Sort projects, putting 'not released' at top (newest) or bottom (oldest)
export function sortProjects(projects: typeof allProjects, notReleasedNewest = true) {
  return [...projects].sort((a, b) => {
    const aNotReleased = a.date.toLowerCase() === 'not released';
    const bNotReleased = b.date.toLowerCase() === 'not released';
    if (aNotReleased && bNotReleased) return 0;
    if (aNotReleased) return notReleasedNewest ? -1 : 1;
    if (bNotReleased) return notReleasedNewest ? 1 : -1;
    // Both are released, compare dates
    if (notReleasedNewest) {
      // Newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      // Oldest first
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });
}

export const allProjects = [
  {
    href: "https://lulaobobao.itch.io/robo-rebellion-dawn-of-the-machine",
    imgSrc: "/images/robo rebellion.png",
    title: "Robo Rebellion: Dawn of the Machine",
    date: "2024-07-10",
    displayDate: formatDisplayDate("2024-07-10"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/not-suepr-maria-63",
    imgSrc: "/images/Not Suepr Maria 63.webp",
    title: "Not Suepr Maria 63",
    date: "2025-04-17",
    displayDate: formatDisplayDate("2025-04-17"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/the-royal-spin",
    imgSrc: "/images/the royal spin logo.png",
    title: "The Royal Spin",
    date: "2025-7-11",
    displayDate: formatDisplayDate("2025-7-11"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://gx.games/games/ef2jjg/when-time-collides/",
    imgSrc: "/images/when time collides.webp",
    title: "When Time Collides",
    date: "2022-03-18",
    displayDate: formatDisplayDate("2022-03-18"),
    technologies: [
      "/images/gamemaker studio logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/shy",
    imgSrc: "/images/SHYGame.jpg",
    title: "Shy",
    date: "2024-05-26",
    displayDate: formatDisplayDate("2024-05-26"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://github.com/Linkerpink/Open-Pixel-Art",
    imgSrc: "/images/open pixel art temp logo.png",
    title: "Open Pixel Art",
    date: "not released",
    displayDate: formatDisplayDate("not released"),
    technologies: [
      "/images/godot logo.svg",
      "/images/gdscript logo.webp",
    ],
  },
  {
    href: "",
    imgSrc: "/images/one tool.webp",
    title: "One Tool",
    date: "2024-9-10",
    displayDate: formatDisplayDate("2024-9-10"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/slimetastic-punchout",
    imgSrc: "/images/slimetastic punchout cover art.png",
    title: "Slimetastic Punchout",
    date: "2024-12-5",
    displayDate: formatDisplayDate("2024-12-5"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",
    imgSrc: "/images/fnaf unity fortnite official game godot.webp",
    title: "Fnaf Unity Fortnite Official Game Godot",
    date: "not released",
    displayDate: formatDisplayDate("not released"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "",
    imgSrc: "/images/not grow a garden temp logo.png",
    title: "Not Grow A Garden",
    date: "not released",
    displayDate: formatDisplayDate("not released"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://github.com/Linkerpink/shmup-2",
    imgSrc: "/images/shmup 2.webp",
    title: "SHMUP 2",
    date: "2024-10-10",
    displayDate: formatDisplayDate("2024-10-10"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/not-not-balatro",
    imgSrc: "/images/not not balatro.webp",
    title: "Not Not Balatro",
    date: "2025-01-27",
    displayDate: formatDisplayDate("2025-01-27"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://rileytimmerman.itch.io/bug-exterminator",
    imgSrc: "/images/shmup.webp",
    title: "Bug Exterminator",
    date: "2024-4-4",
    displayDate: formatDisplayDate("2024-4-4"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/asteroids-3d",
    imgSrc: "/images/asteroids 3d.webp",
    title: "Asteroids 3D",
    date: "2024-03-01",
    displayDate: formatDisplayDate("2024-03-01"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
  {
    href: "https://linkerpink.itch.io/disco-dungeon",
    imgSrc: "/images/disco dungeon temp.webp",
    title: "Disco Dungeon",
    date: "2024-04-26",
    displayDate: formatDisplayDate("2024-04-26"),
    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
    ],
  },
];
