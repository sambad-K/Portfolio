import type { PortfolioData } from "../types/portfolio";

export const defaultPortfolioData: PortfolioData = {
  hero: {
    name: "Sambad Khatiwada",
    role: "AI/ML and Backend Development Enthusiast",
    availability: "Available for internships and impactful software projects",
    summary:
      "I enjoy building projects that solve real-world problems using AI/ML and scalable backend systems. For me, development is both meaningful and fun.",
    quickFacts: [
      "AI/ML + backend development enthusiast",
      "Real-world problem-solving through projects",
      "Building practical products while having fun",
    ],
    resumeUrl: "/resume.pdf",
    profileImage: "/images/profile.jpg",
  },
  contacts: [
    {
      title: "Email",
      value: "sambadkhatiwada939@gmail.com",
      href: "mailto:sambadkhatiwada939@gmail.com",
      note: "Best for project discussions",
    },
    {
      title: "LinkedIn",
      value: "linkedin.com/in/sambad-khatiwada",
      href: "https://www.linkedin.com/in/sambad-khatiwada/",
      note: "Professional networking",
    },
    {
      title: "GitHub",
      value: "github.com/sambad-K",
      href: "https://github.com/sambad-K",
      note: "Code and open-source work",
    },
  ],
  footer: {
    copyrightText: "© Sambad Khatiwada. Built with Next.js.",
    note: "Focused on smooth interactions, clarity, and speed.",
  },
  projects: [
    {
      title: "Smart Campus Event Intelligence",
      startDate: "2025-01-01",
      endDate: "2025-04-01",
      intro:
        "An AI-assisted event platform that predicts attendance and optimizes registration flow for better event planning.",
      problemStatement:
        "Campus organizers faced overbooking, poor participation forecasting, and delayed communication across multiple channels.",
      functionalRequirements: [
        "Event creation, scheduling, and categorization",
        "Role-based authentication for admin, organizer, and student",
        "Realtime seat availability and registration tracking",
        "AI-based attendance prediction and reminders",
      ],
      nonFunctionalRequirements: [
        "Fast API response under peak registration load",
        "Secure data storage and user access control",
        "Mobile-first responsive interface",
        "High reliability during event windows",
      ],
      architectureImage: "/next.svg",
      resultImages: [
        {
          title: "Registration Conversion",
          src: "/globe.svg",
          description: "Registration completion improved with prediction-driven slot allocation.",
        },
        {
          title: "System Throughput",
          src: "/vercel.svg",
          description: "Optimized backend APIs handled higher concurrent traffic during launch windows.",
        },
      ],
      snapshots: [
        {
          title: "Organizer Dashboard",
          src: "/window.svg",
          description: "Single panel for event control, capacity updates, and attendee status.",
        },
        {
          title: "Student Registration Screen",
          src: "/file.svg",
          description: "Streamlined registration with fast feedback and clear validation.",
        },
      ],
      githubUrl: "https://github.com/sambad-K",
      stack: ["Next.js", "Node.js", "PostgreSQL"],
    },
    {
      title: "AI Learning Assistant",
      startDate: "2025-05-01",
      endDate: "2025-07-01",
      intro:
        "An AI/ML-powered study assistant that converts notes into structured summaries and personalized revision content.",
      problemStatement:
        "Students lost revision time manually organizing notes and struggled to focus on high-impact topics before exams.",
      functionalRequirements: [
        "Upload and parse lecture content",
        "Automatic topic-level summary generation",
        "Flashcard generation and practice mode",
        "Difficulty-aware revision recommendation",
      ],
      nonFunctionalRequirements: [
        "Accurate output consistency",
        "Low-latency processing for typical note sizes",
        "Scalable service for growing course data",
        "Simple and accessible UI for daily usage",
      ],
      architectureImage: "/next.svg",
      resultImages: [
        {
          title: "Study Time Reduction",
          src: "/globe.svg",
          description: "Students completed revision cycles faster with AI-generated summaries.",
        },
        {
          title: "Retention Improvement",
          src: "/vercel.svg",
          description: "Personalized flashcard repetition improved concept retention over time.",
        },
      ],
      snapshots: [
        {
          title: "Topic Summary View",
          src: "/window.svg",
          description: "Structured summaries grouped by chapter and concept.",
        },
        {
          title: "Flashcard Practice UI",
          src: "/file.svg",
          description: "Focused revision mode with progress-aware navigation.",
        },
      ],
      githubUrl: "https://github.com/sambad-K",
      stack: ["React", "Python", "FastAPI"],
    },
    {
      title: "Backend Realtime Collaboration Hub",
      startDate: "2025-08-01",
      endDate: "2025-10-01",
      intro:
        "A backend-first realtime collaboration system focused on reliable communication and scalable room orchestration.",
      problemStatement:
        "Teams needed a fast and dependable collaboration channel without high infrastructure complexity.",
      functionalRequirements: [
        "Realtime room messaging",
        "User authentication and session handling",
        "Presence indicators and typing status",
        "Event-driven notifications and activity logs",
      ],
      nonFunctionalRequirements: [
        "Minimal delivery latency",
        "Stable websocket connection handling",
        "Graceful degradation on weak networks",
        "Secure message transport and backend resilience",
      ],
      architectureImage: "/next.svg",
      resultImages: [
        {
          title: "Message Delivery Latency",
          src: "/globe.svg",
          description: "Improved socket orchestration reduced message delay during active sessions.",
        },
        {
          title: "Concurrent User Stability",
          src: "/vercel.svg",
          description: "Connection reliability remained stable across multiple active collaboration rooms.",
        },
      ],
      snapshots: [
        {
          title: "Chat Room Interface",
          src: "/window.svg",
          description: "Readable and distraction-free conversation layout.",
        },
        {
          title: "Presence Panel",
          src: "/file.svg",
          description: "Live online status to support active collaboration.",
        },
      ],
      githubUrl: "https://github.com/sambad-K",
      stack: ["Next.js", "WebSocket", "MongoDB"],
    },
  ],
};
