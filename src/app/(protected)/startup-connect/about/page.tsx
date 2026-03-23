import { Briefcase, UserCircle2, SearchCheck, Handshake, Sparkles } from "lucide-react";

const steps = [
  {
    title: "Founders Create Gigs",
    description:
      "Startups post real project needs with timeline, budget, and required skills so students know exactly what is expected.",
    icon: Briefcase,
    accent: "orange",
  },
  {
    title: "Students Build Profiles",
    description:
      "Students showcase portfolio work, technical skills, and interests to increase match quality with startup opportunities.",
    icon: UserCircle2,
    accent: "blue",
  },
  {
    title: "Smart Matching Happens",
    description:
      "The system surfaces suitable talent for each gig based on skills, project type, and collaboration fit.",
    icon: SearchCheck,
    accent: "orange",
  },
  {
    title: "Teams Start Building",
    description:
      "Founders and selected students connect, align expectations, and begin working on startup milestones together.",
    icon: Handshake,
    accent: "blue",
  },
];

const benefits = [
  "Faster talent discovery for startups",
  "Real-world project experience for students",
  "Clear skill-based opportunity matching",
  "A single platform for campus-startup collaboration",
];

export default function StartupConnectAboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            
          </p>
          <h1 className="text-4xl md:text-6xl font-black  tracking-tighter text-slate-950">
            <span className="text-green-600">How</span> <span className="text-blue-700">This</span> <span className="text-orange-600">System Works</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            UniNexus connects startup founders with university talent through a simple project workflow designed for speed, clarity, and skill-first collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isOrange = step.accent === "orange";
            return (
              <article
                key={step.title}
                className="rounded-[30px] border border-slate-100 bg-white p-7 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isOrange ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Step {index + 1}
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-3">{step.title}</h2>
                <p className="text-slate-600 leading-relaxed font-medium">{step.description}</p>
              </article>
            );
          })}
        </div>

        <div className="rounded-[32px] border border-slate-100 p-8 md:p-10 bg-linear-to-r from-blue-50/60 to-orange-50/60">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-950 mb-5">
            <span className="text-green-600">Why Teams Love</span> <span className="text-blue-700">UniNexus?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="bg-white rounded-2xl border border-white/60 px-4 py-3 font-bold text-slate-700">
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
