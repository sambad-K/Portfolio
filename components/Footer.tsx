import { useState } from "react";
import type { FooterContent } from "../types/portfolio";

type FooterProps = {
  footer: FooterContent;
  editable?: boolean;
  onChange?: (footer: FooterContent) => void;
};

export default function Footer({ footer, editable = false, onChange }: FooterProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <footer className="border-t border-sky-300/20 px-6 py-8 md:px-20">
      <div className="mx-auto w-full max-w-6xl">
        {editable ? (
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="rounded-lg border border-sky-300/40 px-3 py-1 text-xs font-semibold text-sky-200"
            >
              {isEditing ? "Close Footer Edit" : "Edit Footer"}
            </button>
          </div>
        ) : null}

        {editable && isEditing ? (
          <div className="mb-4 grid gap-2 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm">
            <input
              value={footer.copyrightText}
              onChange={(event) =>
                onChange?.({
                  ...footer,
                  copyrightText: event.target.value,
                })
              }
              className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
            <input
              value={footer.note}
              onChange={(event) =>
                onChange?.({
                  ...footer,
                  note: event.target.value,
                })
              }
              className="rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            />
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>{footer.copyrightText}</p>
          <p>{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}