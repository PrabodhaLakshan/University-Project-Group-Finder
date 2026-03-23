export default function ProjectGroupFinderCard() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="
        w-full max-w-md
        rounded-2xl border border-white/10
        bg-linear-to-b from-[#0a1020] to-black
        p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-blue-500/40
        hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
        group
      ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">
              Project Group Finder
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Find teammates by skills, year & specialization
            </p>
          </div>

          {/* Status pill */}
          <span className="
            text-xs font-medium
            rounded-full px-3 py-1
            bg-blue-500/10 text-blue-300
            border border-blue-500/20
            group-hover:bg-blue-500/15
            transition
          ">
            Live
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Stat label="Matches" value="128" />
          <Stat label="Requests" value="34" />
          <Stat label="Groups" value="12" />
        </div>

        {/* CTA */}
        <button className="
          mt-6 w-full rounded-xl
          bg-blue-600/90 text-white font-medium
          py-3
          transition-all duration-300
          hover:bg-blue-500
          hover:shadow-[0_0_18px_rgba(59,130,246,0.35)]
          active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-blue-400/60
        ">
          Create Profile
        </button>

        {/* Hover Glow Line */}
        <div className="
          mt-6 h-px w-full
          bg-linear-to-r from-transparent via-blue-500/40 to-transparent
          opacity-40 group-hover:opacity-80
          transition
        " />
        
        <p className="text-xs text-white/40 mt-4">
          Tip: Hover to highlight — dark UI with subtle neon glow.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="
      rounded-xl border border-white/10
      bg-white/5 p-3
      transition
      hover:bg-blue-500/10 hover:border-blue-500/25
    ">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-lg font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
