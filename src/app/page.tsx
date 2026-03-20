import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ShoppingCart, Users, Briefcase, BookOpen, Zap } from "lucide-react";

export default function HomePage() {
  const modules = [
    {
      title: "Uni-Mart",
      description: "Buy and sell items with campus community",
      icon: ShoppingCart,
      href: "/uni-mart",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Project Group Finder",
      description: "Find teammates for your projects",
      icon: Users,
      href: "/modules/project-group-finder",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Tutor Connect",
      description: "Connect with tutors or offer tutoring",
      icon: BookOpen,
      href: "/modules/tutor-connect",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Startup Connect",
      description: "Collaborate on startup ideas",
      icon: Briefcase,
      href: "/modules/startup-connect",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Welcome to UniNexus
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Your all-in-one platform for campus community, collaboration, and commerce
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className={`h-1 bg-gradient-to-r ${module.color}`} />
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${module.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                    {module.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {module.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="border border-white/10 rounded-xl p-8 bg-white/5">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fast & Easy</h3>
            <p className="text-gray-400">Get started in seconds with our intuitive interface</p>
          </div>

          <div className="border border-white/10 rounded-xl p-8 bg-white/5">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-green-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
            <p className="text-gray-400">Build relationships with your campus community</p>
          </div>

          <div className="border border-white/10 rounded-xl p-8 bg-white/5">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="text-purple-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Collaborate</h3>
            <p className="text-gray-400">Work together on projects and opportunities</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">Explore one of our modules and join the UniNexus community today</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/uni-mart"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Explore Uni-Mart
            </Link>
            <Link 
              href="/modules/project-group-finder"
              className="border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-3 rounded-lg font-semibold transition"
            >
              Find Teams
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
