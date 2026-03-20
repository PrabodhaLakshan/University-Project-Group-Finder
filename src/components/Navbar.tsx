"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Menu, X, LogOut, Home } from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "@/app/modules/uni-mart/components/NotificationBell";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Uni-Mart", href: "/uni-mart" },
    { label: "Project Finder", href: "/modules/project-group-finder" },
    { label: "Tutor Connect", href: "/modules/tutor-connect" },
    { label: "Startup Connect", href: "/modules/startup-connect" },
    { label: "Profile", href: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a1020]">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-white">
          UniNexus
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-white/70">
          {!loading && !user && (
            <>
              <Link className="text-sm hover:text-blue-400 transition" href="/login">
                Login
              </Link>
              <Link className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition" href="/register">
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  className="hover:text-blue-400 transition text-sm" 
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                className="hover:text-blue-400 transition text-sm flex items-center gap-1" 
                href="/modules/uni-mart/messages"
              >
                💬 Messages
              </Link>
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 hover:border-red-500/40 hover:bg-red-500/10 text-white transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f1420] border-t border-white/10 px-6 py-4 space-y-3">
          {!loading && !user && (
            <>
              <Link 
                className="block text-sm text-white/70 hover:text-blue-400 transition py-2" 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                className="block text-sm text-white/70 hover:text-blue-400 transition py-2" 
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  className="block text-sm text-white/70 hover:text-blue-400 transition py-2" 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-white/70 hover:text-red-400 transition py-2 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
