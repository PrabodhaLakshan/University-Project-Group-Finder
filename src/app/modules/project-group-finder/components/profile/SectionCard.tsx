"use client";

export default function SectionCard({
  title,
  hint,
  children,
  accent = "blue",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  accent?: "blue" | "indigo" | "green" | "orange";
}) {
  const accentBar =
    accent === "indigo"
      ? "before:bg-indigo-500"
      : accent === "green"
        ? "before:bg-green-500"
        : accent === "orange"
          ? "before:bg-orange-500"
          : "before:bg-blue-500";

  return (
    <section
      className={[
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px]",
        accentBar,
      ].join(" ")}
    >
      {/* Section header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>

      {/* Section body */}
      <div className="p-5">{children}</div>
    </section>
  );
}