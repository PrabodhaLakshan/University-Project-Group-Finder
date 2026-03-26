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
    primary: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25",
    accent: "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25",
    success: "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25",
  };
  return (
    <div className={clsx("h-12 w-12 rounded-2xl grid place-items-center transform hover:scale-110 transition-transform duration-300", map[tone])}>
      <div className="h-4 w-4 rounded-full bg-white/90" />
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
    <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title}</h3>
        {right}
      </div>
      <div className="p-6">{children}</div>
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

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      "Verified": "bg-green-100 text-green-700 border-green-200",
      "Inbox": "bg-blue-100 text-blue-700 border-blue-200",
      "Order": "bg-orange-100 text-orange-700 border-orange-200",
      "Post": "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[tag] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25" />
            <div>
              <p className="text-sm font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">UniNexus</p>
              <p className="text-xs text-gray-500">Learn • Connect • Build • Earn</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 shadow-sm hover:shadow-md">
              🔔 Notifications
            </button>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500" />
              <div className="leading-tight">
                <p className="text-sm font-medium text-gray-900">Student</p>
                <p className="text-xs text-gray-500">IT23xxxxxxx</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl px-5 py-6">
        {/* Hero */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
              <p className="text-blue-100 text-lg">Your academic journey continues • 3 new updates today</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl mb-1">🎓</div>
                <div className="text-sm">Level 12</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <IconCircle tone={stat.tone || "primary"} />
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.sub}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <Card title="Recent Activity">
            <div className="space-y-4">
              {activity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.meta}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getTagColor(item.tag)}`}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                📚 Find Groups
              </button>
              <button className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                👨‍🏫 Book Tutor
              </button>
              <button className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium text-sm hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                🛒 Shop
              </button>
              <button className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-sm hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                💡 Ideas
              </button>
            </div>
          </Card>

          {/* Modules */}
          <Card title="All Modules">
            <div className="space-y-3">
              {modules.map((module, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <IconCircle tone={module.tone} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{module.name}</p>
                    <p className="text-xs text-gray-500">{module.desc}</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    →
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
