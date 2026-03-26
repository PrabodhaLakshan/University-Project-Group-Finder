"use client";

export default function EmptyAddCard({
  text,
  onAdd,
}: {
  text: string;
  onAdd: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="group w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500 text-lg font-bold transition group-hover:bg-blue-100">
          +
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
            Add details
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{text}</p>
        </div>
      </div>
    </button>
  );
}