import type { MouseEvent } from "react";
import { scrollToSection } from "../utils/scrollToSection";

type NavbarProps = {
  resumeUrl: string;
};

export default function Navbar({ resumeUrl }: NavbarProps) {
  const handleSectionClick =
    (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      scrollToSection(sectionId);
    };

  return (
    <header className="sticky top-0 z-40 border-b border-sky-300/20 bg-slate-950/90">
      <nav className="mx-auto flex h-16 w-[min(1120px,92vw)] items-center justify-between">
        <a
          href="#top"
          onClick={handleSectionClick("top")}
          className="rounded-md px-2 py-1 text-sm font-semibold tracking-[0.16em] text-sky-200 transition hover:text-sky-100"
        >
          SAMBAD.K
        </a>

        <div className="flex items-center gap-2 text-sm text-slate-300 md:gap-6">
          <a
            className="rounded-md px-3 py-2 transition hover:bg-sky-400/10 hover:text-sky-100"
            href="#projects"
            onClick={handleSectionClick("projects")}
          >
            Projects
          </a>
          <a
            className="rounded-md px-3 py-2 transition hover:bg-sky-400/10 hover:text-sky-100"
            href="#contact"
            onClick={handleSectionClick("contact")}
          >
            Contact
          </a>
          <a
            className="rounded-full border border-sky-300/60 px-4 py-2 text-sky-100 transition hover:bg-sky-300/15"
            href={resumeUrl}
            download="Sambad_Khatiwada_Resume.pdf"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}