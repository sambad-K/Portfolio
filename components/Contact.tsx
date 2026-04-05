import { useState } from "react";
import type { ContactChannel } from "../types/portfolio";

type ContactProps = {
  channels: ContactChannel[];
  editable?: boolean;
  onChange?: (channels: ContactChannel[]) => void;
};

export default function Contact({ channels, editable = false, onChange }: ContactProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section id="contact" className="px-6 py-20 md:px-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-sky-400/20 bg-slate-900/75 p-6 shadow-lg md:p-10">
        {editable ? (
          <div className="mb-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="rounded-lg border border-sky-300/40 px-3 py-1 text-xs font-semibold text-sky-200"
            >
              {isEditing ? "Close Contact Edit" : "Edit Contact"}
            </button>
            <button
              type="button"
              onClick={() =>
                onChange?.([
                  ...channels,
                  { title: "New", value: "", href: "", note: "" },
                ])
              }
              className="rounded-lg border border-sky-300/40 px-3 py-1 text-xs font-semibold text-sky-200"
            >
              Add Channel
            </button>
          </div>
        ) : null}

        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Contact</p>
            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              Let&apos;s build something meaningful
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300 md:text-base">
            Reach out with your idea, internship opportunity, or collaboration plan. I usually respond
            within 24 hours.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {channels.map((channel, index) =>
            editable && isEditing ? (
              <div
                key={`${channel.title}-${index}`}
                className="space-y-2 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4"
              >
                <input
                  value={channel.title}
                  onChange={(event) =>
                    onChange?.(
                      channels.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, title: event.target.value } : item
                      )
                    )
                  }
                  placeholder="Title"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                />
                <input
                  value={channel.value}
                  onChange={(event) =>
                    onChange?.(
                      channels.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, value: event.target.value } : item
                      )
                    )
                  }
                  placeholder="Value"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                />
                <input
                  value={channel.href}
                  onChange={(event) =>
                    onChange?.(
                      channels.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, href: event.target.value } : item
                      )
                    )
                  }
                  placeholder="Link"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                />
                <input
                  value={channel.note}
                  onChange={(event) =>
                    onChange?.(
                      channels.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, note: event.target.value } : item
                      )
                    )
                  }
                  placeholder="Note"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => onChange?.(channels.filter((_, itemIndex) => itemIndex !== index))}
                  className="rounded-lg border border-rose-500/50 px-3 py-1 text-xs text-rose-300"
                >
                  Delete
                </button>
              </div>
            ) : (
              <a
                key={channel.title}
                href={channel.href}
                target={channel.title === "Email" ? undefined : "_blank"}
                rel={channel.title === "Email" ? undefined : "noreferrer"}
                className="group rounded-2xl border border-slate-700/80 bg-slate-950/80 p-5 transition duration-200 hover:border-sky-300/60 hover:bg-slate-900/90"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-300">{channel.title}</p>
                <p className="mt-3 break-all text-sm font-medium text-slate-100 md:text-base">{channel.value}</p>
                <p className="mt-2 text-xs text-slate-400">{channel.note}</p>
                <p className="mt-4 text-sm font-semibold text-sky-300 transition group-hover:text-sky-200">
                  Open channel
                </p>
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
