"use client";

import MediaCard from "../media-card"; // adjust path as needed
import { allProjects } from "../all-projects";
import { useParams } from "next/navigation";

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

  // Separate images
  const screenshots = (project.media ?? []).filter((m) => m.type === "image");

  // Combined video-like media in original order
  const videoLikeMedia = (project.media ?? []).filter((m) =>
    ["video", "gif", "youtubeId"].includes(m.type)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Title & Date */}
      <div>
        <h1 className="text-3xl font-bold mb-1">{project.title}</h1>
        <p className="text-sm text-gray-500">{project.displayDate}</p>
      </div>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, index) => (
          <img key={index} src={tech} alt="" className="w-8 h-8 object-contain" />
        ))}
      </div>

      {/* Screenshots (images) */}
      {screenshots.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Screenshots</h2>
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
        </div>
      )}

      {/* Combined Videos, GIFs, YouTube */}
      {videoLikeMedia.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Media</h2>
          <div className="flex flex-wrap justify-start gap-6">
            {videoLikeMedia.map((mediaItem, i) => {
              switch (mediaItem.type) {
                case "video":
                  return (
                    <MediaCard
                      key={i}
                      videoSrc={mediaItem.src}
                      title={`Video ${i + 1}`}
                      size="medium"
                    />
                  );
                case "gif":
                  return (
                    <MediaCard
                      key={i}
                      gifSrc={mediaItem.src}
                      title={`GIF ${i + 1}`}
                      size="medium"
                    />
                  );
                case "youtubeId":
                  return (
                    <MediaCard
                      key={i}
                      youtubeId={mediaItem.src}
                      title={`YouTube Video ${i + 1}`}
                      size="medium"
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <p className="mt-6">{project.description}</p>
      </div>

      {/* External Link */}
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline block mt-6"
        >
          View Project
        </a>
      )}
    </div>
  );
}
