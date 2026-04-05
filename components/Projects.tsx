import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project, SectionImage } from "../types/portfolio";

type ProjectsProps = {
  projects: Project[];
  editable?: boolean;
  onChange?: (projects: Project[]) => void;
};

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const parsedValue = parseDateValue(value);
  const [viewMonth, setViewMonth] = useState(parsedValue.month);
  const [viewYear, setViewYear] = useState(parsedValue.year);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextValue = parseDateValue(value);
    setViewMonth(nextValue.month);
    setViewYear(nextValue.year);

    const onPointerDown = (event: PointerEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, value]);

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const leadingBlankDays = new Date(viewYear, viewMonth - 1, 1).getDay();
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(viewYear, viewMonth - 1, 1));

  return (
    <div ref={pickerRef} className="relative">
      <p className="block text-xs font-semibold uppercase tracking-wide text-sky-300">{label}</p>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-left text-sm text-white transition hover:border-sky-300/50"
        aria-expanded={isOpen}
      >
        <span>{value ? formatDateLabel(value) : "Select date"}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-sky-300">Pick</span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-[19rem] rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl shadow-slate-950/80">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                const previous = new Date(viewYear, viewMonth - 2, 1);
                setViewYear(previous.getFullYear());
                setViewMonth(previous.getMonth() + 1);
              }}
              className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200 transition hover:border-sky-300/50 hover:text-white"
              aria-label="Previous month"
            >
              ←
            </button>
            <p className="text-sm font-semibold text-white">{monthLabel}</p>
            <button
              type="button"
              onClick={() => {
                const next = new Date(viewYear, viewMonth, 1);
                setViewYear(next.getFullYear());
                setViewMonth(next.getMonth() + 1);
              }}
              className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200 transition hover:border-sky-300/50 hover:text-white"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlankDays }).map((_, index) => (
              <span key={`blank-${index}`} className="h-9" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const candidate = buildDateValue(viewYear, viewMonth, day);
              const isSelected = candidate === value;

              return (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => {
                    onChange(candidate);
                    setIsOpen(false);
                  }}
                  className={[
                    "h-9 rounded-lg text-sm transition",
                    isSelected
                      ? "bg-sky-300 text-slate-950 font-semibold"
                      : "border border-slate-700 text-slate-200 hover:border-sky-300/40 hover:bg-sky-300/10",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const nextValue = buildDateValue(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  today.getDate()
                );
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth() + 1);
                onChange(nextValue);
                setIsOpen(false);
              }}
              className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-sky-300/50 hover:text-white"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="rounded-lg border border-rose-500/40 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function parseDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function buildDateValue(year: number, month: number, day: number) {
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}`;
}

function formatDateLabel(value: string) {
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatProjectTimeFrame(project: Project) {
  const formatMonthYear = (value: string) => {
    const normalized = value.length === 7 ? `${value}-01` : value;
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(parsed);
  };

  if (project.startDate && project.endDate) {
    return `${formatMonthYear(project.startDate)} - ${formatMonthYear(project.endDate)}`;
  }

  if (project.startDate) {
    return `Start: ${formatMonthYear(project.startDate)}`;
  }

  if (project.endDate) {
    return `End: ${formatMonthYear(project.endDate)}`;
  }

  return project.timeFrame || "Time frame not set";
}

function RequirementEditor({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">{title}</p>
        <button
          type="button"
          onClick={onAdd}
          className="rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200"
        >
          Add Row
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400">No items yet. Add one row at a time.</p>
        ) : null}

        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2">
            <input
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              placeholder={`${title} ${index + 1}`}
              className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="shrink-0 rounded-lg border border-rose-500/40 px-3 py-2 text-xs text-rose-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailImages({ items }: { items: SectionImage[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-sky-300/20 bg-slate-900/70 p-4">
          <h5 className="mb-2 text-sm font-semibold text-sky-200">{item.title}</h5>
          <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950/60">
            <Image src={item.src} alt={item.title} fill className="object-contain p-6" />
          </div>
          <p className="text-sm text-slate-300">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function Projects({ projects, editable = false, onChange }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [showCreateTitleModal, setShowCreateTitleModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [draftProject, setDraftProject] = useState<Project | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const emptyImage: SectionImage = {
    title: "New image",
    src: "/file.svg",
    description: "Short description",
  };

  const emptyProject: Project = {
    title: "New Project",
    startDate: "",
    endDate: "",
    intro: "",
    problemStatement: "",
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    architectureImage: "/next.svg",
    resultImages: [],
    snapshots: [],
    githubUrl: "",
    stack: [],
  };

  const updateProject = (projectIndex: number, updater: (project: Project) => Project) => {
    if (!onChange) {
      return;
    }

    onChange(
      projects.map((project, index) => (index === projectIndex ? updater(project) : project))
    );
  };

  const uploadProjectImage = async (
    file: File,
    projectTitle: string,
    section: "architecture" | "result" | "snapshot"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectTitle", projectTitle);
    formData.append("section", section);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { path?: string; error?: string };
    if (!response.ok || !payload.path) {
      throw new Error(payload.error || "Image upload failed");
    }

    return payload.path;
  };

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [selectedProject]);

  return (
    <>
      <section id="projects" className="px-6 py-20 md:px-20 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-3 md:mb-14">
            <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              Selected Work
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Unique projects across AI/ML, NLP, and computer vision
            </h2>
            <p className="mt-4 max-w-3xl text-sm text-slate-300">
              I prefer unique projects with varying domains, particularly focused on AI/ML, NLP, computer vision, and Django backends.
            </p>
            </div>
            {editable ? (
              <button
                type="button"
                onClick={() => setShowCreateTitleModal(true)}
                className="rounded-lg border border-sky-300/40 px-3 py-2 text-xs font-semibold text-sky-200"
              >
                Add New Project
              </button>
            ) : null}
          </div>

          {editable ? (
            <div className="mb-6 rounded-2xl border border-dashed border-sky-300/30 bg-slate-900/45 p-4">
              <h3 className="text-sm font-semibold text-sky-200">Add New Project</h3>
              <p className="mt-1 text-xs text-slate-300">
                Start with a title, then fill complete project details in a smooth popup editor.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateTitleModal(true)}
                className="mt-3 rounded-lg border border-sky-300/40 px-3 py-2 text-xs font-semibold text-sky-200"
              >
                Create Project Draft
              </button>
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, projectIndex) => (
              <article
                key={project.title}
                className="rounded-2xl border border-sky-300/20 bg-slate-900/70 p-5 shadow-lg transition duration-200 hover:border-sky-300/50 hover:bg-slate-900/90"
              >
                <h3 className="mb-3 text-xl font-semibold text-white">{project.title}</h3>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                  {formatProjectTimeFrame(project)}
                </p>
                <p className="mb-5 text-sm leading-relaxed text-slate-300">{project.intro}</p>

                <ul className="mb-6 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-sky-300/35 bg-sky-300/10 px-3 py-1 text-xs text-sky-100"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="rounded-lg border border-sky-300/50 bg-sky-300/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-300/20"
                >
                  Explore
                </button>

                {editable ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProjectIndex(projectIndex)}
                      className="rounded-lg border border-sky-300/35 px-3 py-1 text-xs text-sky-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange?.(projects.filter((_, index) => index !== projectIndex))}
                      className="rounded-lg border border-rose-500/40 px-3 py-1 text-xs text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {editable && editingProjectIndex !== null ? (
        <div className="fixed inset-0 z-[60]">
          <div
            onClick={() => setEditingProjectIndex(null)}
            className="absolute inset-0 bg-slate-950/80"
          />
          <div className="absolute inset-0 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl rounded-3xl border border-sky-300/30 bg-slate-900 p-6 shadow-2xl md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Edit Project</h3>
                <button
                  type="button"
                  onClick={() => setEditingProjectIndex(null)}
                  className="rounded-lg border border-slate-600 px-3 py-1 text-sm text-slate-300"
                >
                  Close
                </button>
              </div>

              {projects[editingProjectIndex] ? (
                <div className="space-y-3 text-sm">
                  <input
                    value={projects[editingProjectIndex].title}
                    onChange={(event) =>
                      updateProject(editingProjectIndex, (item) => ({ ...item, title: event.target.value }))
                    }
                    placeholder="Heading (Project title)"
                    className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <DateField
                      label="Start date"
                      value={projects[editingProjectIndex].startDate}
                      onChange={(value) =>
                        updateProject(editingProjectIndex, (item) => ({ ...item, startDate: value }))
                      }
                    />
                    <DateField
                      label="End date"
                      value={projects[editingProjectIndex].endDate}
                      onChange={(value) =>
                        updateProject(editingProjectIndex, (item) => ({ ...item, endDate: value }))
                      }
                    />
                  </div>

                  <textarea
                    value={projects[editingProjectIndex].intro}
                    onChange={(event) =>
                      updateProject(editingProjectIndex, (item) => ({ ...item, intro: event.target.value }))
                    }
                    rows={2}
                    placeholder="Basic intro"
                    className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                  />

                  <textarea
                    value={projects[editingProjectIndex].problemStatement}
                    onChange={(event) =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        problemStatement: event.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Problem Statement"
                    className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                  />

                  <input
                    value={projects[editingProjectIndex].githubUrl}
                    onChange={(event) =>
                      updateProject(editingProjectIndex, (item) => ({ ...item, githubUrl: event.target.value }))
                    }
                    placeholder="GitHub link"
                    className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                  />

                  <input
                    value={projects[editingProjectIndex].architectureImage}
                    onChange={(event) =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        architectureImage: event.target.value,
                      }))
                    }
                    placeholder="System architecture image"
                    className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                  />
                  <label className="inline-flex w-fit cursor-pointer items-center rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200">
                    Upload Architecture Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) {
                          return;
                        }

                        const key = `edit-architecture-${editingProjectIndex}`;
                        setUploadingKey(key);
                        try {
                          const imagePath = await uploadProjectImage(
                            file,
                            projects[editingProjectIndex].title,
                            "architecture"
                          );

                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            architectureImage: imagePath,
                          }));
                        } catch (error) {
                          window.alert(error instanceof Error ? error.message : "Image upload failed");
                        } finally {
                          setUploadingKey(null);
                          event.currentTarget.value = "";
                        }
                      }}
                    />
                  </label>
                  {uploadingKey === `edit-architecture-${editingProjectIndex}` ? (
                    <p className="text-xs text-sky-300">Uploading architecture image...</p>
                  ) : null}

                  <RequirementEditor
                    title="Functional requirements"
                    items={projects[editingProjectIndex].functionalRequirements}
                    onChange={(index, value) =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        functionalRequirements: item.functionalRequirements.map((entry, entryIndex) =>
                          entryIndex === index ? value : entry
                        ),
                      }))
                    }
                    onAdd={() =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        functionalRequirements: [...item.functionalRequirements, ""],
                      }))
                    }
                    onRemove={(index) =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        functionalRequirements: item.functionalRequirements.filter(
                          (_, entryIndex) => entryIndex !== index
                        ),
                      }))
                    }
                  />

                  <RequirementEditor
                    title="Non functional requirements"
                    items={projects[editingProjectIndex].nonFunctionalRequirements}
                    onChange={(index, value) =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        nonFunctionalRequirements: item.nonFunctionalRequirements.map((entry, entryIndex) =>
                          entryIndex === index ? value : entry
                        ),
                      }))
                    }
                    onAdd={() =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        nonFunctionalRequirements: [...item.nonFunctionalRequirements, ""],
                      }))
                    }
                    onRemove={(index) =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        nonFunctionalRequirements: item.nonFunctionalRequirements.filter(
                          (_, entryIndex) => entryIndex !== index
                        ),
                      }))
                    }
                  />

                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Result and analysis images</p>
                  {projects[editingProjectIndex].resultImages.map((image, imageIndex) => (
                    <div key={`${image.title}-${imageIndex}`} className="space-y-2 rounded-lg border border-slate-700 p-3">
                      <input
                        value={image.title}
                        onChange={(event) =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            resultImages: item.resultImages.map((entry, entryIndex) =>
                              entryIndex === imageIndex ? { ...entry, title: event.target.value } : entry
                            ),
                          }))
                        }
                        placeholder="Heading"
                        className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                      />
                      <input
                        value={image.src}
                        onChange={(event) =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            resultImages: item.resultImages.map((entry, entryIndex) =>
                              entryIndex === imageIndex ? { ...entry, src: event.target.value } : entry
                            ),
                          }))
                        }
                        placeholder="Image path/url"
                        className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                      />
                      <label className="inline-flex w-fit cursor-pointer items-center rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) {
                              return;
                            }

                            const key = `edit-result-${editingProjectIndex}-${imageIndex}`;
                            setUploadingKey(key);
                            try {
                              const imagePath = await uploadProjectImage(
                                file,
                                projects[editingProjectIndex].title,
                                "result"
                              );

                              updateProject(editingProjectIndex, (item) => ({
                                ...item,
                                resultImages: item.resultImages.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, src: imagePath } : entry
                                ),
                              }));
                            } catch (error) {
                              window.alert(error instanceof Error ? error.message : "Image upload failed");
                            } finally {
                              setUploadingKey(null);
                              event.currentTarget.value = "";
                            }
                          }}
                        />
                      </label>
                      {uploadingKey === `edit-result-${editingProjectIndex}-${imageIndex}` ? (
                        <p className="text-xs text-sky-300">Uploading result image...</p>
                      ) : null}
                      <input
                        value={image.description}
                        onChange={(event) =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            resultImages: item.resultImages.map((entry, entryIndex) =>
                              entryIndex === imageIndex ? { ...entry, description: event.target.value } : entry
                            ),
                          }))
                        }
                        placeholder="Explanation"
                        className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            resultImages: item.resultImages.filter((_, entryIndex) => entryIndex !== imageIndex),
                          }))
                        }
                        className="rounded border border-rose-500/40 px-2 py-1 text-xs text-rose-300"
                      >
                        Delete Image
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        resultImages: [...item.resultImages, { ...emptyImage }],
                      }))
                    }
                    className="rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200"
                  >
                    Add Result Image
                  </button>

                  <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-sky-300">Snapshots</p>
                  {projects[editingProjectIndex].snapshots.map((image, imageIndex) => (
                    <div key={`${image.title}-${imageIndex}`} className="space-y-2 rounded-lg border border-slate-700 p-3">
                      <input
                        value={image.title}
                        onChange={(event) =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            snapshots: item.snapshots.map((entry, entryIndex) =>
                              entryIndex === imageIndex ? { ...entry, title: event.target.value } : entry
                            ),
                          }))
                        }
                        placeholder="Heading"
                        className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                      />
                      <input
                        value={image.src}
                        onChange={(event) =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            snapshots: item.snapshots.map((entry, entryIndex) =>
                              entryIndex === imageIndex ? { ...entry, src: event.target.value } : entry
                            ),
                          }))
                        }
                        placeholder="Image path/url"
                        className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                      />
                      <label className="inline-flex w-fit cursor-pointer items-center rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) {
                              return;
                            }

                            const key = `edit-snapshot-${editingProjectIndex}-${imageIndex}`;
                            setUploadingKey(key);
                            try {
                              const imagePath = await uploadProjectImage(
                                file,
                                projects[editingProjectIndex].title,
                                "snapshot"
                              );

                              updateProject(editingProjectIndex, (item) => ({
                                ...item,
                                snapshots: item.snapshots.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, src: imagePath } : entry
                                ),
                              }));
                            } catch (error) {
                              window.alert(error instanceof Error ? error.message : "Image upload failed");
                            } finally {
                              setUploadingKey(null);
                              event.currentTarget.value = "";
                            }
                          }}
                        />
                      </label>
                      {uploadingKey === `edit-snapshot-${editingProjectIndex}-${imageIndex}` ? (
                        <p className="text-xs text-sky-300">Uploading snapshot image...</p>
                      ) : null}
                      <input
                        value={image.description}
                        onChange={(event) =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            snapshots: item.snapshots.map((entry, entryIndex) =>
                              entryIndex === imageIndex ? { ...entry, description: event.target.value } : entry
                            ),
                          }))
                        }
                        placeholder="Explanation"
                        className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateProject(editingProjectIndex, (item) => ({
                            ...item,
                            snapshots: item.snapshots.filter((_, entryIndex) => entryIndex !== imageIndex),
                          }))
                        }
                        className="rounded border border-rose-500/40 px-2 py-1 text-xs text-rose-300"
                      >
                        Delete Image
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateProject(editingProjectIndex, (item) => ({
                        ...item,
                        snapshots: [...item.snapshots, { ...emptyImage }],
                      }))
                    }
                    className="rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200"
                  >
                    Add Snapshot Image
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {editable && showCreateTitleModal ? (
        <div className="fixed inset-0 z-[61]">
          <div
            onClick={() => setShowCreateTitleModal(false)}
            className="absolute inset-0 bg-slate-950/80"
          />

          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-sky-300/30 bg-slate-900 p-5 shadow-2xl">
              <h3 className="text-lg font-semibold text-white">Create New Project</h3>
              <p className="mt-1 text-sm text-slate-300">
                Give your project a title. A blank structured editor will open next.
              </p>

              <input
                value={newProjectTitle}
                onChange={(event) => setNewProjectTitle(event.target.value)}
                placeholder="Project title"
                className="mt-4 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTitleModal(false);
                    setNewProjectTitle("");
                  }}
                  className="rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = newProjectTitle.trim() || "Untitled Project";
                    setDraftProject({ ...emptyProject, title });
                    setShowCreateTitleModal(false);
                    setNewProjectTitle("");
                  }}
                  className="rounded-lg border border-sky-300/40 px-3 py-2 text-xs font-semibold text-sky-200"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editable && draftProject ? (
        <div className="fixed inset-0 z-[62]">
          <div onClick={() => setDraftProject(null)} className="absolute inset-0 bg-slate-950/80" />
          <div className="absolute inset-0 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl rounded-3xl border border-sky-300/30 bg-slate-900 p-6 shadow-2xl md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">New Project Draft</h3>
                <button
                  type="button"
                  onClick={() => setDraftProject(null)}
                  className="rounded-lg border border-slate-600 px-3 py-1 text-sm text-slate-300"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <input
                  value={draftProject.title}
                  onChange={(event) => setDraftProject((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                  placeholder="Heading (Project title)"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <DateField
                    label="Start date"
                    value={draftProject.startDate}
                    onChange={(value) =>
                      setDraftProject((prev) => (prev ? { ...prev, startDate: value } : prev))
                    }
                  />
                  <DateField
                    label="End date"
                    value={draftProject.endDate}
                    onChange={(value) =>
                      setDraftProject((prev) => (prev ? { ...prev, endDate: value } : prev))
                    }
                  />
                </div>

                <textarea
                  value={draftProject.intro}
                  onChange={(event) => setDraftProject((prev) => (prev ? { ...prev, intro: event.target.value } : prev))}
                  rows={2}
                  placeholder="Basic intro"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                />

                <textarea
                  value={draftProject.problemStatement}
                  onChange={(event) =>
                    setDraftProject((prev) => (prev ? { ...prev, problemStatement: event.target.value } : prev))
                  }
                  rows={2}
                  placeholder="Problem Statement"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                />

                <input
                  value={draftProject.githubUrl}
                  onChange={(event) =>
                    setDraftProject((prev) => (prev ? { ...prev, githubUrl: event.target.value } : prev))
                  }
                  placeholder="GitHub link"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                />

                <input
                  value={draftProject.architectureImage}
                  onChange={(event) =>
                    setDraftProject((prev) => (prev ? { ...prev, architectureImage: event.target.value } : prev))
                  }
                  placeholder="System architecture image"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                />
                <label className="inline-flex w-fit cursor-pointer items-center rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200">
                  Upload Architecture Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file || !draftProject) {
                        return;
                      }

                      const key = "draft-architecture";
                      setUploadingKey(key);
                      try {
                        const imagePath = await uploadProjectImage(file, draftProject.title, "architecture");
                        setDraftProject((prev) => (prev ? { ...prev, architectureImage: imagePath } : prev));
                      } catch (error) {
                        window.alert(error instanceof Error ? error.message : "Image upload failed");
                      } finally {
                        setUploadingKey(null);
                        event.currentTarget.value = "";
                      }
                    }}
                  />
                </label>
                {uploadingKey === "draft-architecture" ? (
                  <p className="text-xs text-sky-300">Uploading architecture image...</p>
                ) : null}

                <RequirementEditor
                  title="Functional requirements"
                  items={draftProject.functionalRequirements}
                  onChange={(index, value) =>
                    setDraftProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            functionalRequirements: prev.functionalRequirements.map((entry, entryIndex) =>
                              entryIndex === index ? value : entry
                            ),
                          }
                        : prev
                    )
                  }
                  onAdd={() =>
                    setDraftProject((prev) =>
                      prev ? { ...prev, functionalRequirements: [...prev.functionalRequirements, ""] } : prev
                    )
                  }
                  onRemove={(index) =>
                    setDraftProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            functionalRequirements: prev.functionalRequirements.filter(
                              (_, entryIndex) => entryIndex !== index
                            ),
                          }
                        : prev
                    )
                  }
                />

                <RequirementEditor
                  title="Non functional requirements"
                  items={draftProject.nonFunctionalRequirements}
                  onChange={(index, value) =>
                    setDraftProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            nonFunctionalRequirements: prev.nonFunctionalRequirements.map((entry, entryIndex) =>
                              entryIndex === index ? value : entry
                            ),
                          }
                        : prev
                    )
                  }
                  onAdd={() =>
                    setDraftProject((prev) =>
                      prev ? { ...prev, nonFunctionalRequirements: [...prev.nonFunctionalRequirements, ""] } : prev
                    )
                  }
                  onRemove={(index) =>
                    setDraftProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            nonFunctionalRequirements: prev.nonFunctionalRequirements.filter(
                              (_, entryIndex) => entryIndex !== index
                            ),
                          }
                        : prev
                    )
                  }
                />

                <input
                  value={draftProject.stack.join(", ")}
                  onChange={(event) =>
                    setDraftProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            stack: event.target.value
                              .split(",")
                              .map((v) => v.trim())
                              .filter(Boolean),
                          }
                        : prev
                    )
                  }
                  placeholder="Tech stack (comma separated)"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Result and analysis images</p>
                {draftProject.resultImages.map((image, imageIndex) => (
                  <div key={`${image.title}-${imageIndex}`} className="space-y-2 rounded-lg border border-slate-700 p-3">
                    <input
                      value={image.title}
                      onChange={(event) =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                resultImages: prev.resultImages.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, title: event.target.value } : entry
                                ),
                              }
                            : prev
                        )
                      }
                      placeholder="Heading"
                      className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                    />
                    <input
                      value={image.src}
                      onChange={(event) =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                resultImages: prev.resultImages.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, src: event.target.value } : entry
                                ),
                              }
                            : prev
                        )
                      }
                      placeholder="Image path/url"
                      className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                    />
                    <label className="inline-flex w-fit cursor-pointer items-center rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file || !draftProject) {
                            return;
                          }

                          const key = `draft-result-${imageIndex}`;
                          setUploadingKey(key);
                          try {
                            const imagePath = await uploadProjectImage(file, draftProject.title, "result");
                            setDraftProject((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    resultImages: prev.resultImages.map((entry, entryIndex) =>
                                      entryIndex === imageIndex ? { ...entry, src: imagePath } : entry
                                    ),
                                  }
                                : prev
                            );
                          } catch (error) {
                            window.alert(error instanceof Error ? error.message : "Image upload failed");
                          } finally {
                            setUploadingKey(null);
                            event.currentTarget.value = "";
                          }
                        }}
                      />
                    </label>
                    {uploadingKey === `draft-result-${imageIndex}` ? (
                      <p className="text-xs text-sky-300">Uploading result image...</p>
                    ) : null}
                    <input
                      value={image.description}
                      onChange={(event) =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                resultImages: prev.resultImages.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, description: event.target.value } : entry
                                ),
                              }
                            : prev
                        )
                      }
                      placeholder="Explanation"
                      className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                resultImages: prev.resultImages.filter((_, entryIndex) => entryIndex !== imageIndex),
                              }
                            : prev
                        )
                      }
                      className="rounded border border-rose-500/40 px-2 py-1 text-xs text-rose-300"
                    >
                      Delete Image
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDraftProject((prev) =>
                      prev ? { ...prev, resultImages: [...prev.resultImages, { ...emptyImage }] } : prev
                    )
                  }
                  className="rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200"
                >
                  Add Result Image
                </button>

                <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-sky-300">Snapshots</p>
                {draftProject.snapshots.map((image, imageIndex) => (
                  <div key={`${image.title}-${imageIndex}`} className="space-y-2 rounded-lg border border-slate-700 p-3">
                    <input
                      value={image.title}
                      onChange={(event) =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                snapshots: prev.snapshots.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, title: event.target.value } : entry
                                ),
                              }
                            : prev
                        )
                      }
                      placeholder="Heading"
                      className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                    />
                    <input
                      value={image.src}
                      onChange={(event) =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                snapshots: prev.snapshots.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, src: event.target.value } : entry
                                ),
                              }
                            : prev
                        )
                      }
                      placeholder="Image path/url"
                      className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                    />
                    <label className="inline-flex w-fit cursor-pointer items-center rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file || !draftProject) {
                            return;
                          }

                          const key = `draft-snapshot-${imageIndex}`;
                          setUploadingKey(key);
                          try {
                            const imagePath = await uploadProjectImage(file, draftProject.title, "snapshot");
                            setDraftProject((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    snapshots: prev.snapshots.map((entry, entryIndex) =>
                                      entryIndex === imageIndex ? { ...entry, src: imagePath } : entry
                                    ),
                                  }
                                : prev
                            );
                          } catch (error) {
                            window.alert(error instanceof Error ? error.message : "Image upload failed");
                          } finally {
                            setUploadingKey(null);
                            event.currentTarget.value = "";
                          }
                        }}
                      />
                    </label>
                    {uploadingKey === `draft-snapshot-${imageIndex}` ? (
                      <p className="text-xs text-sky-300">Uploading snapshot image...</p>
                    ) : null}
                    <input
                      value={image.description}
                      onChange={(event) =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                snapshots: prev.snapshots.map((entry, entryIndex) =>
                                  entryIndex === imageIndex ? { ...entry, description: event.target.value } : entry
                                ),
                              }
                            : prev
                        )
                      }
                      placeholder="Explanation"
                      className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraftProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                snapshots: prev.snapshots.filter((_, entryIndex) => entryIndex !== imageIndex),
                              }
                            : prev
                        )
                      }
                      className="rounded border border-rose-500/40 px-2 py-1 text-xs text-rose-300"
                    >
                      Delete Image
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDraftProject((prev) =>
                      prev ? { ...prev, snapshots: [...prev.snapshots, { ...emptyImage }] } : prev
                    )
                  }
                  className="rounded border border-sky-300/40 px-2 py-1 text-xs text-sky-200"
                >
                  Add Snapshot Image
                </button>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftProject(null)}
                    className="rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!draftProject) {
                        return;
                      }
                      onChange?.([...projects, draftProject]);
                      setDraftProject(null);
                    }}
                    className="rounded-lg border border-sky-300/40 px-3 py-2 text-xs font-semibold text-sky-200"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedProject ? (
        <div className="fixed inset-0 z-50" aria-hidden={!selectedProject}>
          <div
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 bg-slate-950/75"
          />

          <div className="absolute inset-0 overflow-y-auto p-4 md:p-8">
            <div
              className="mx-auto w-full max-w-5xl rounded-3xl border border-sky-300/30 bg-slate-900 p-6 shadow-2xl transition duration-200 md:p-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-detail-title"
            >
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 id="project-detail-title" className="text-2xl font-bold text-white md:text-3xl">
                    {selectedProject.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-300 hover:text-sky-200"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-8 text-slate-200">
                  <section>
                    <h4 className="mb-2 text-xl font-semibold text-sky-200">Project title</h4>
                    <p className="mb-2 text-sm uppercase tracking-[0.18em] text-sky-300">
                      {formatProjectTimeFrame(selectedProject)}
                    </p>
                    <p className="text-slate-300">{selectedProject.intro}</p>
                  </section>

                  <section>
                    <h4 className="mb-2 text-xl font-semibold text-sky-200">Problem Statement</h4>
                    <p className="text-slate-300">{selectedProject.problemStatement}</p>
                  </section>

                  <section>
                    <h4 className="mb-2 text-xl font-semibold text-sky-200">Requirement Analysis</h4>

                    <h5 className="mb-2 mt-3 text-base font-semibold text-white">Functional requirement</h5>
                    <ul className="list-disc space-y-1 pl-5 text-slate-300">
                      {selectedProject.functionalRequirements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <h5 className="mb-2 mt-5 text-base font-semibold text-white">Non functional requirement</h5>
                    <ul className="list-disc space-y-1 pl-5 text-slate-300">
                      {selectedProject.nonFunctionalRequirements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="mb-3 text-xl font-semibold text-sky-200">System architecture</h4>
                    <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-sky-300/25 bg-slate-950/60 md:h-72">
                      <Image
                        src={selectedProject.architectureImage}
                        alt={`${selectedProject.title} architecture`}
                        fill
                        className="object-contain p-6"
                      />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-3 text-xl font-semibold text-sky-200">Result and analysis</h4>
                    <DetailImages items={selectedProject.resultImages} />
                  </section>

                  <section>
                    <h4 className="mb-3 text-xl font-semibold text-sky-200">Snapshots</h4>
                    <DetailImages items={selectedProject.snapshots} />
                  </section>

                  <section>
                    <h4 className="mb-2 text-xl font-semibold text-sky-200">Explore project on Git hub</h4>
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-lg border border-sky-300/45 bg-sky-300/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-300/20"
                    >
                      Github account
                    </a>
                  </section>
                </div>
              </>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}