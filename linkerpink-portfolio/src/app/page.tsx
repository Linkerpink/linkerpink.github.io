import Image from 'next/image'
import engImg from './images/eng.png'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl">
        {/* Left Image */}
        <div className="w-100 h-100 relative flex-shrink-0">
          <Image
            src={engImg}
            alt="Engineer Illustration"
            fill
            className="object-contain rounded-xl"
          />
        </div>

        {/* Right Text */}
        <div className="text-center md:text-center">
          <h1 className="text-5xl font-bold mb-4">Hello there, my name is Noah van Uunen</h1>
          <p className="text-lg md:text-center">
            I am a 17 year old game developer who comes from the Netherlands. I have been making games for 2 years now (primarly in Unity using C#). I enjoy the process of programming games and seeing my ideas come to life in fun and playable games. I am currently studying at Grafisch Lyceum Utrecht for game development. Outside of developing games I also like writing, editing and recording video's and playing games.
          </p>
        </div>
      </div>
    </main>
  );
}
