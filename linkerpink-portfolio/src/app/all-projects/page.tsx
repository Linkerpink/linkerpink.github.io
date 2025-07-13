"use client";
import GameCard from "../game-card";
import { allProjects, sortProjects } from "./all-projects";
import { useState } from "react";

export default function AllProjectsPage() {
  const [sortType, setSortType] = useState<'original' | 'alphabetical' | 'oldest' | 'newest'>('original');

  let sortedProjects = [...allProjects];
  if (sortType === 'alphabetical') {
    sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortType === 'oldest') {
    sortedProjects = sortProjects(allProjects, false);
  } else if (sortType === 'newest') {
    sortedProjects = sortProjects(allProjects, true);
  }

  return (
    <main className="min-h-screen py-12 px-1 flex flex-col items-center justify-start">
      <h1 className="text-5xl font-bold mb-8 text-center">All Projects</h1>
      <div className="mb-8 flex flex-wrap gap-4 justify-center items-center">
        <label className="text-lg font-semibold">Sort by:</label>
        <select
          className="px-4 py-2 rounded-lg border shadow focus:outline-none"
          value={sortType}
          onChange={e => setSortType(e.target.value as typeof sortType)}
        >
          <option value="original">Original order</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="oldest">Oldest first</option>
          <option value="newest">Newest first</option>
        </select>
      </div>
      <div className="flex flex-wrap justify-center gap-6 w-full px-0" style={{maxWidth: '100%'}}>
        {sortedProjects.map((project, i) => (
          <GameCard key={i} {...project} size="small" />
        ))}
      </div>
    </main>
  );
}
