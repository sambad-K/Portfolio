import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { defaultPortfolioData } from "../data/defaultPortfolioData";
import type { PortfolioData } from "../types/portfolio";

const STORAGE_KEY = "portfolio-data-v1";

type PortfolioContextValue = {
  data: PortfolioData;
  setData: Dispatch<SetStateAction<PortfolioData>>;
  resetData: () => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function mergePortfolioData(source: unknown): PortfolioData {
  if (!source || typeof source !== "object") {
    return defaultPortfolioData;
  }

  const parsed = source as Partial<PortfolioData>;

  const normalizeDateValue = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) {
      return "";
    }

    const clean = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      return clean;
    }

    if (/^\d{4}-\d{2}$/.test(clean)) {
      return `${clean}-01`;
    }

    return "";
  };

  const normalizedProjects = Array.isArray(parsed.projects)
    ? parsed.projects.map((project, index) => ({
        ...defaultPortfolioData.projects[index],
        ...project,
        startDate: normalizeDateValue((project as { startDate?: unknown }).startDate),
        endDate: normalizeDateValue((project as { endDate?: unknown }).endDate),
      }))
    : defaultPortfolioData.projects;

  return {
    hero: {
      ...defaultPortfolioData.hero,
      ...(parsed.hero ?? {}),
    },
    contacts: Array.isArray(parsed.contacts) ? parsed.contacts : defaultPortfolioData.contacts,
    projects: normalizedProjects,
    footer: {
      ...defaultPortfolioData.footer,
      ...(parsed.footer ?? {}),
    },
  };
}

export function PortfolioProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [hasLoadedPersistedData, setHasLoadedPersistedData] = useState(false);

  useEffect(() => {
    const loadSavedData = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }

        setData(mergePortfolioData(JSON.parse(raw)));
      } catch {
        // Keep the default SSR-safe state if localStorage is unavailable.
      } finally {
        setHasLoadedPersistedData(true);
      }
    };

    const animationFrameId = window.requestAnimationFrame(loadSavedData);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (!hasLoadedPersistedData) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage write errors (private mode, quota, etc.)
    }
  }, [data, hasLoadedPersistedData]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) {
        return;
      }
      try {
        setData(mergePortfolioData(JSON.parse(event.newValue)));
      } catch {
        // Ignore malformed external updates.
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const resetData = () => setData(defaultPortfolioData);

  const value = useMemo(
    () => ({
      data,
      setData,
      resetData,
    }),
    [data]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }
  return context;
}
