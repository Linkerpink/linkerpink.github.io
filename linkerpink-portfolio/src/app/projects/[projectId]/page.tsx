  "use client";

  import MediaCard from "../media-card"; // adjust path as needed
  import { allProjects } from "../all-projects";
  import { useParams } from "next/navigation";
  import Image from "next/image";

  import CodeBlock from "../code-block";

  export default function ProjectDetails() {
    const { projectId } = useParams() as { projectId: string };
    const project = allProjects.find((p) => p.slug === projectId);

    if (!project) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Project not found</h1>
        </div>
      );
    }

    const screenshots = (project.media ?? []).filter((m) => m.type === "image");
    const videoLikeMedia = (project.media ?? []).filter((m) =>
      ["video", "gif", "youtubeId"].includes(m.type)
    );

    return (
      <div className="min-h-screen relative px-6">
        {/* Banner */}
        {project.banner && (
          <div className="w-full mb-10 rounded-3xl overflow-hidden aspect-[10/3] shadow-[0px_3px_6px_rgba(0,0,0,0.5)] select-none">
            <Image
              src={project.banner}
              alt={`${project.title} Banner`}
              width={2400}
              height={800}
              className="w-full h-full object-cover banner-animate"
              priority
              draggable={false}
            />
          </div>
        )}

        {/* Title + Icon + Date */}
        <header className="mb-10 flex flex-col md:flex-row gap-4 items-center">
          {/* Left: Icon + Title Block */}
          <div className="flex-1 bg-white rounded-3xl p-5">
            <div className="flex items-center gap-4">
              {project.icon && (
                <Image
                  src={project.icon}
                  alt={`${project.title} Icon`}
                  width={512}
                  height={512}
                  className="w-38 h-38 object-cover rounded-3xl border-8 border-white shadow-[0px_0px_6px_rgba(0,0,0,0.5)] aspect-[1/1] banner-animate select-none"
                  draggable={false}
                />
              )}
              <div>
                <h1 className="text-2xl font-extrabold leading-tight">
                  {project.title}
                </h1>
                <p className="text-sm text-[#5F5F5F] mt-2">
                  {project.displayDate}
                </p>

                {project.technologies.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {project.technologies.map((icon, i) => (
                      <Image
                        key={i}
                        src={icon}
                        alt="tech"
                        width={512}
                        height={512}
                        className="w-8 h-8 object-contain"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Button Container */}
          {(project.href || project.github) && (
            <div className="w-full md:w-[250px] shrink-0 bg-white rounded-3xl p-6 flex flex-col gap-4 self-center">
              {/* View Project (dynamic platform) */}
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2.5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold interactable-object select-none"
                  draggable={false}
                >
                  <Image
                    src={
                      project.platform?.toLowerCase().includes("gx")
                        ? "/images/gx games logo.jpg"
                        : "/images/itch.io logo.png"
                    }
                    alt={`${project.platform || "Platform"} Logo`}
                    width={48}
                    height={48}
                    draggable={false}
                    className="rounded-md select-none"
                  />
                  View on {project.platform || "Platform"}
                </a>
              )}

              {/* GitHub */}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2.5 py-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-900 text-white font-semibold interactable-object select-none"
                  draggable={false}
                >
                  <Image
                    src="/images/github logo.svg"
                    alt="GitHub Icon"
                    width={48}
                    height={48}
                    draggable={false}
                    className="rounded-md select-none"
                  />
                  View on GitHub
                </a>
              )}
            </div>
          )}
        </header>

        {/* Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#F57C00] rounded-sm" />
            Software Description
          </h2>
          <hr className="border-t-2 border-[#BEBEBE] mb-6" />
          <p className="text-[#5F5F5F] leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </section>

        {/* Code Snippets */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#F57C00] rounded-sm" />
            Code Snippets
          </h2>
          <hr className="border-t-2 border-[#BEBEBE] mb-6" />

          {project.codeSnippets && project.codeSnippets.length > 0 && (
            <section className="mb-8">
              {project.codeSnippets.map(
                ({ language, name, description, code }, i) => (
                  <div
                    key={i}
                    className="mb-6 rounded-md overflow-hidden"
                  >
                    <CodeBlock
                      language={language}
                      name={name}
                      description={description}
                    >
                      {code}
                    </CodeBlock>
                  </div>
                )
              )}
            </section>
          )}
        </section>

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#F57C00] rounded-sm" />
              Screenshots
            </h2>
            <hr className="border-t-2 border-[#BEBEBE] mb-6" />
            <div className="flex flex-wrap justify-center gap-6">
              {screenshots.map((img, i) => (
                <MediaCard
                  key={i}
                  imgSrc={img.src}
                  title={project.title}
                  size="small"
                />
              ))}
            </div>
          </section>
        )}

        {/* Videos / GIFs / YouTube */}
        {videoLikeMedia.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#F57C00] rounded-sm" />
              Related Videos
            </h2>
            <hr className="border-t-2 border-[#BEBEBE] mb-6" />
            <div className="flex flex-wrap justify-center gap-6">
              {videoLikeMedia.map((mediaItem, i) => {
                switch (mediaItem.type) {
                  case "video":
                    return (
                      <MediaCard
                        key={i}
                        videoSrc={mediaItem.src}
                        title={project.title}
                        size="large"
                      />
                    );
                  case "gif":
                    return (
                      <MediaCard
                        key={i}
                        gifSrc={mediaItem.src}
                        title={`GIF ${i + 1}`}
                        size="small"
                      />
                    );
                  case "youtubeId":
                    return (
                      <MediaCard
                        key={i}
                        youtubeId={mediaItem.src}
                        title={`Video ${i + 1}`}
                        size="large"
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </section>
        )}
      </div>
    );
  }
