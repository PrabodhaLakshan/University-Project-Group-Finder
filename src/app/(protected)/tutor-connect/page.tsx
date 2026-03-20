"use client";

import * as React from "react";

type Stat = {
  label: string;
  value: string;
  sub?: string;
  tone?: "primary" | "accent" | "success";
};

type Activity = {
  title: string;
  meta: string;
  tag: string;
};

function clsx(...arr: Array<string | false | undefined>) {
  return arr.filter(Boolean).join(" ");
}

function IconCircle({ tone }: { tone: "primary" | "accent" | "success" }) {
  const map = {
    primary: "bg-blue-600/10 text-blue-600 ring-blue-600/15",
    accent: "bg-orange-500/10 text-orange-600 ring-orange-500/15",
    success: "bg-green-500/10 text-green-600 ring-green-500/15",
  };
  return (
    <div className={clsx("h-10 w-10 rounded-xl ring-1 grid place-items-center", map[tone])}>
      <div className="h-3 w-3 rounded-full bg-current opacity-70" />
    </div>
  );
}

function Card({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function DashboardSample() {
  const stats: Stat[] = [
    { label: "Profile Completion", value: "78%", sub: "+6% this week", tone: "primary" },
    { label: "Matches Found", value: "12", sub: "3 new today", tone: "success" },
    { label: "Pending Requests", value: "4", sub: "needs action", tone: "accent" },
    { label: "Marketplace Orders", value: "2", sub: "in progress", tone: "primary" },
  ];

  const activity: Activity[] = [
    { title: "Result sheet uploaded", meta: "Project Group Finder • 2h ago", tag: "Verified" },
    { title: "New tutor message received", meta: "Tutor Connect • 5h ago", tag: "Inbox" },
    { title: "Order placed: Arduino Kit", meta: "Uni Mart • Yesterday", tag: "Order" },
    { title: "Startup idea posted", meta: "Startup Connect • 2 days ago", tag: "Post" },
  ];

  const modules = [
    { name: "Project Group Finder", desc: "Find teammates by skills & marks", tone: "primary" as const },
    { name: "Tutor Connect", desc: "Chat & book tutors", tone: "success" as const },
    { name: "Uni Mart", desc: "Buy/sell university items", tone: "accent" as const },
    { name: "Startup Connect", desc: "Ideas, teams, opportunities", tone: "primary" as const },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">UniNexus</p>
              <p className="text-xs text-slate-500">Learn • Connect • Build • Earn</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              Notifications
            </button>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <div className="h-8 w-8 rounded-xl bg-slate-200" />
              <div className="leading-tight">
                <p className="text-sm font-medium text-slate-900">Student</p>
                <p className="text-xs text-slate-500">IT23xxxxxxx</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl px-5 py-6">
        {/* Hero */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
                Welcome back 👋
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage everything in one place — your profile, groups, tutors, and marketplace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Update Profile
              </button>
              <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
                Find Group
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                View Messages
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <IconCircle tone={s.tone ?? "primary"} />
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  Live
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-600">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{s.value}</p>
                {s.sub && <p className="mt-1 text-xs text-slate-500">{s.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Modules */}
          <div className="lg:col-span-2">
            <Card
              title="Modules"
              right={
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  View all
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {modules.map((m) => (
                  <button
                    key={m.name}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-blue-200 hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-3">
                      <IconCircle tone={m.tone === "accent" ? "accent" : m.tone === "success" ? "success" : "primary"} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{m.name}</p>
                        <p className="mt-1 text-xs text-slate-600">{m.desc}</p>
                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-600 group-hover:text-slate-900">
                          Open <span className="translate-x-0 transition group-hover:translate-x-0.5">→</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Activity */}
            <div className="mt-6">
              <Card title="Recent Activity">
                <ul className="space-y-3">
                  {activity.map((a, idx) => (
                    <li
                      key={idx}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">{a.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{a.meta}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                        {a.tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6">
            <Card title="Quick Actions">
              <div className="grid gap-3">
                <button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                  Upload Result Sheet
                </button>
                <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Create Group Post
                </button>
                <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  List Item on Uni Mart
                </button>
                <button className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600">
                  Book a Tutor
                </button>
              </div>
            </Card>

            <Card title="Tips">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Increase your matches</p>
                <p className="mt-1 text-xs text-slate-600">
                  Add skills + publish verified marks to improve the group finder accuracy.
                </p>
                <button className="mt-3 text-xs font-medium text-blue-700 hover:text-blue-800">
                  Update profile →
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Marketplace safety</p>
                <p className="mt-1 text-xs text-slate-600">
                  Meet in campus public places and confirm item condition before payment.
                </p>
                <button className="mt-3 text-xs font-medium text-orange-700 hover:text-orange-800">
                  Read guidelines →
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} UniNexus • Learn • Connect • Build • Earn
        </footer>
      </main>
    </div>
  );
}