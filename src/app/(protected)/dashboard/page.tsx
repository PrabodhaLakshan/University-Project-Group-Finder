"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Users, Briefcase, BookOpen, Zap } from "lucide-react";

const modules = [
  {
    title: "Uni-Mart",
    description: "Buy and sell items with campus community",
    icon: ShoppingCart,
    href: "/modules/uni-mart",
    // Logo: blue-purple "U" shape
    iconBg: "from-blue-500 to-indigo-600",
    topBar: "from-blue-400 to-indigo-500",
    borderColor: "border-blue-200 hover:border-blue-400",
    glow: "hover:shadow-[0_4px_24px_rgba(99,102,241,0.25)]",
    titleColor: "text-blue-700",
  },
  {
    title: "Project Group Finder",
    description: "Find teammates for your projects",
    icon: Users,
    href: "/project-group-finder",
    // Logo: orange-amber "N" swoosh
    iconBg: "from-orange-400 to-amber-500",
    topBar: "from-orange-400 to-amber-500",
    borderColor: "border-orange-200 hover:border-orange-400",
    glow: "hover:shadow-[0_4px_24px_rgba(251,146,60,0.30)]",
    titleColor: "text-orange-600",
  },
  {
    title: "Tutor Connect",
    description: "Connect with tutors or offer tutoring",
    icon: BookOpen,
    href: "/tutor-connect",
    // Logo: green dot accent
    iconBg: "from-green-400 to-emerald-500",
    topBar: "from-green-400 to-emerald-500",
    borderColor: "border-green-200 hover:border-green-400",
    glow: "hover:shadow-[0_4px_24px_rgba(52,211,153,0.30)]",
    titleColor: "text-green-700",
  },
  {
    title: "Startup Connect",
    description: "Collaborate on startup ideas",
    icon: Briefcase,
    href: "/startup-connect",
    // Logo: purple-indigo mix
    iconBg: "from-purple-500 to-violet-600",
    topBar: "from-purple-400 to-violet-500",
    borderColor: "border-purple-200 hover:border-purple-400",
    glow: "hover:shadow-[0_4px_24px_rgba(168,85,247,0.28)]",
    titleColor: "text-purple-700",
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">

        {/* Hero / Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your all-in-one platform for campus community, collaboration, and commerce
          </p>
        </div>

        {/* User Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="mt-1 font-semibold text-gray-800">{user.student_id}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 font-semibold text-gray-800">{user.email}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
            <p className="text-sm text-gray-500">Next Step</p>
            <p className="mt-1 font-semibold text-gray-800">Create your profile &amp; skills</p>
          </div>
        </div>

        {/* Modules Grid */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">Explore Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className={`group relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${module.borderColor} ${module.glow}`}
              >
                {/* Colored top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${module.topBar}`} />
                <div className="p-6">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${module.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className="text-white" size={26} />
                  </div>
                  {/* Title */}
                  <h3 className={`text-lg font-bold mb-1 transition-colors ${module.titleColor}`}>
                    {module.title}
                  </h3>
                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border border-gray-200 rounded-xl p-7 bg-white shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-blue-600" size={22} />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Fast &amp; Easy</h3>
            <p className="text-gray-500 text-sm">Get started in seconds with our intuitive interface</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-7 bg-white shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-green-600" size={22} />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Connect</h3>
            <p className="text-gray-500 text-sm">Build relationships with your campus community</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-7 bg-white shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="text-purple-600" size={22} />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Collaborate</h3>
            <p className="text-gray-500 text-sm">Work together on projects and opportunities</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to get started?</h2>
          <p className="text-gray-500 mb-6">Explore one of our modules and join the UniNexus community today</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/modules/uni-mart"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm"
            >
              Explore Uni-Mart
            </Link>
            <Link
              href="/modules/project-group-finder"
              className="border border-blue-400 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition"
            >
              Find Teams
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
