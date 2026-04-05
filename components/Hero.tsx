import Image from "next/image";
import { useState } from "react";
import { scrollToSection } from "../utils/scrollToSection";
import type { HeroContent } from "../types/portfolio";

type HeroProps = {
  hero: HeroContent;
  editable?: boolean;
  onChange?: (hero: HeroContent) => void;
};

export default function Hero({ hero, editable = false, onChange }: HeroProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-28 md:px-20 md:pb-28 md:pt-36">
      <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7 motion-safe:transition-all motion-safe:duration-500">
          {editable ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="rounded-lg border border-sky-300/40 px-3 py-1 text-xs font-semibold text-sky-200"
              >
                {isEditing ? "Close Hero Edit" : "Edit Hero"}
              </button>
            </div>
          ) : null}

          {editable && isEditing ? (
            <div className="grid gap-2 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm">
              <input
                value={hero.name}
                onChange={(event) => onChange?.({ ...hero, name: event.target.value })}
                placeholder="Name"
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
              <input
                value={hero.role}
                onChange={(event) => onChange?.({ ...hero, role: event.target.value })}
                placeholder="Role"
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
              <input
                value={hero.availability}
                onChange={(event) => onChange?.({ ...hero, availability: event.target.value })}
                placeholder="Availability"
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
              <textarea
                value={hero.summary}
                onChange={(event) => onChange?.({ ...hero, summary: event.target.value })}
                rows={3}
                placeholder="Summary"
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
              <textarea
                value={hero.quickFacts.join("\n")}
                onChange={(event) =>
                  onChange?.({
                    ...hero,
                    quickFacts: event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                rows={3}
                placeholder="Quick facts (one per line)"
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
              <input
                value={hero.profileImage}
                onChange={(event) => onChange?.({ ...hero, profileImage: event.target.value })}
                placeholder="Profile image URL/path"
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
              <input
                value={hero.resumeUrl}
                onChange={(event) => onChange?.({ ...hero, resumeUrl: event.target.value })}
                placeholder="Resume URL"
                className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
              />
            </div>
          ) : null}

          <p className="w-fit rounded-full border border-sky-300/55 bg-sky-300/10 px-3 py-1 text-sm tracking-wide text-sky-100">
            {hero.availability}
          </p>

          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-bold leading-[1.05] text-white md:text-7xl">
              {hero.name}
            </h1>
            <h2 className="text-xl text-slate-300 md:text-2xl">{hero.role}</h2>
          </div>

          <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            {hero.summary}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 font-semibold text-slate-950 shadow-lg transition duration-200 hover:from-cyan-200 hover:to-blue-300"
              href="#projects"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("projects");
              }}
            >
              Explore Projects
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-sky-300/60 bg-sky-300/10 px-5 py-3 font-semibold text-sky-100 transition duration-200 hover:bg-sky-300/20"
              href={hero.resumeUrl}
              download="Sambad_Khatiwada_Resume.pdf"
            >
              Download Resume
            </a>
          </div>

          <ul className="grid gap-2 pt-2 text-sm text-slate-300 md:grid-cols-2">
            {hero.quickFacts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-2"
              >
                {fact}
              </li>
            ))}
          </ul>

        </div>

        <div className="mx-auto">
          <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-sky-300/50 shadow-xl md:h-[26rem] md:w-[26rem]">
            <Image
              src={hero.profileImage}
              alt={`${hero.name} portrait`}
              fill
              priority
              sizes="(max-width: 768px) 280px, 420px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}