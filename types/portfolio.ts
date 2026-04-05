export type SectionImage = {
  title: string;
  src: string;
  description: string;
};

export type Project = {
  title: string;
  startDate: string;
  endDate: string;
  timeFrame?: string;
  intro: string;
  problemStatement: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  architectureImage: string;
  resultImages: SectionImage[];
  snapshots: SectionImage[];
  githubUrl: string;
  stack: string[];
};

export type HeroContent = {
  name: string;
  role: string;
  availability: string;
  summary: string;
  quickFacts: string[];
  resumeUrl: string;
  profileImage: string;
};

export type ContactChannel = {
  title: string;
  value: string;
  href: string;
  note: string;
};

export type FooterContent = {
  copyrightText: string;
  note: string;
};

export type PortfolioData = {
  hero: HeroContent;
  contacts: ContactChannel[];
  projects: Project[];
  footer: FooterContent;
};
