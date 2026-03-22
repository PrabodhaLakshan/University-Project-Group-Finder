"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Menu, X, LogOut, MessageCircle, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NotificationBell } from "@/app/modules/uni-mart/components/NotificationBell";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const publicLinks = [
    { label: "About Us", href: "/#about-us" },
    { label: "Services", href: "/#services" },
    { label: "Contact Us", href: "/#contact-us" },
  ];

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Uni-Mart", href: "/uni-mart" },
    { label: "Project Finder", href: "/modules/project-group-finder" },
    { label: "Tutor Connect", href: "/modules/tutor-connect" },
    { label: "Startup Connect", href: "/modules/startup-connect" },
  ];

  const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || user.email || "User"
      )}&background=e2e8f0&color=0f172a&size=96&font-size=0.4`
    : "";

  const handleLogout = () => {
    logout();
    router.push("/login");
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`${oxanium.className} sticky top-0 z-50 border-b border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)]`}>
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src="/images/navbar/UniNexus_nav_Logo_lightT.png" 
            alt="UniNexus Logo" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-slate-700">
          {!loading && !user &&
            publicLinks.map((link) => (
              <Link
                key={link.href}
                className="hover:text-blue-600 transition text-base font-semibold"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}

          {!loading && !user && (
            <>
              <Link className="text-base font-semibold hover:text-blue-600 transition" href="/login">
                Login
              </Link>
              <Link className="rounded-md border border-white/70 bg-white/60 px-4 py-2 text-base font-semibold text-slate-800 hover:bg-white/80 transition" href="/register">
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  className="hover:text-blue-600 transition text-base font-semibold" 
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                className="rounded-lg p-2 text-slate-700 hover:bg-white/70 hover:text-blue-600 transition" 
                href="/modules/uni-mart/messages"
                aria-label="Messages"
                title="Messages"
              >
                <MessageCircle size={20} />
              </Link>
              <NotificationBell />

              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg border border-slate-300/70 bg-white/60 px-2.5 py-1.5 hover:bg-white/80 transition"
                >
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="text-left leading-tight">
                    <p className="max-w-[140px] truncate text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="max-w-[140px] truncate text-xs text-slate-600">{user.email}</p>
                  </div>
                  <ChevronDown size={16} className="text-slate-600" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-xl border-t border-white/70 px-6 py-4 space-y-3">
          {!loading && !user &&
            publicLinks.map((link) => (
              <Link
                key={link.href}
                className="block text-base font-semibold text-slate-700 hover:text-blue-600 transition py-2"
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

          {!loading && !user && (
            <>
              <Link 
                className="block text-base font-semibold text-slate-700 hover:text-blue-600 transition py-2" 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                className="block text-base font-semibold text-slate-700 hover:text-blue-600 transition py-2" 
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
                  className="block text-base font-semibold text-slate-700 hover:text-blue-600 transition py-2" 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                className="block text-base font-semibold text-slate-700 hover:text-blue-600 transition py-2"
                href="/modules/uni-mart/messages"
                onClick={() => setMobileMenuOpen(false)}
              >
                Messages
              </Link>
              <Link
                className="block text-base font-semibold text-slate-700 hover:text-blue-600 transition py-2"
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-base font-medium text-slate-700 hover:text-red-500 transition py-2 flex items-center gap-2"
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
