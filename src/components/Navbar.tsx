"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Menu, X, LogOut, ChevronDown, Plus, ShoppingBag, TrendingUp, PackageOpen, Calendar, Clock3, UserPlus, MessageSquare, UsersRound, Users, BarChart3, Trophy } from "lucide-react";
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
  const [uniMartDropdownOpen, setUniMartDropdownOpen] = useState(false);
  const [projectFinderDropdownOpen, setProjectFinderDropdownOpen] = useState(false);
  const [startupDropdownOpen, setStartupDropdownOpen] = useState(false);
  const [tutorDropdownOpen, setTutorDropdownOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const uniMartDropdownRef = useRef<HTMLDivElement | null>(null);
  const projectFinderDropdownRef = useRef<HTMLDivElement | null>(null);
  const startupDropdownRef = useRef<HTMLDivElement | null>(null);
  const tutorDropdownRef = useRef<HTMLDivElement | null>(null);

  const publicLinks = [
    { label: "About Us", href: "/modules/about" },
    { label: "Services", href: "/#services" },
    { label: "Contact Us", href: "/contactus" },
  ];

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  const uniMartQuickLinks = [
    { label: "Post New Item", href: "/modules/uni-mart/new", icon: Plus },
    { label: "My Items", href: "/modules/uni-mart/my-products", icon: ShoppingBag },
    { label: "My Purchases", href: "/modules/uni-mart/purchase-history", icon: PackageOpen },
    { label: "My Sales", href: "/modules/uni-mart/sales-history", icon: TrendingUp },
  ];

  const tutorQuickLinks = [
    { label: "My Booking", href: "/", icon: Calendar },
    { label: "Waitlist", href: "/", icon: Clock3 },
    { label: "Become a Tutor", href: "/", icon: UserPlus },
    { label: "Feedbacks", href: "/", icon: MessageSquare },
  ];

  const projectFinderQuickLinks = [
    { label: "Create or Join Group", href: "/", icon: UsersRound },
    { label: "My Groups", href: "/", icon: Users },
    { label: "My Results", href: "/", icon: BarChart3 },
    { label: "My achievements", href: "/", icon: Trophy },
  ];

  const startupQuickLinks = [
    { label: "post new job", href: "/modules/startup-connect", icon: Plus },
    { label: "Startup Portfolio", href: "/modules/startup-connect", icon: BarChart3 },
    { label: "My Jobs", href: "/modules/startup-connect", icon: ShoppingBag },
    { label: "Hire Student Talent", href: "/modules/startup-connect", icon: UserPlus },
  ];

  const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || user.email || "User"
      )}&background=e2e8f0&color=0f172a&size=96&font-size=0.4`
    : "";

  const formatDisplayName = (name?: string | null, email?: string | null) => {
    const source = (name || "").trim();
    if (source) {
      const parts = source.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
      }
      return parts[0];
    }

    const emailName = (email || "").split("@")[0];
    return emailName || "User";
  };

  const maskEmailForDisplay = (email?: string | null) => {
    if (!email) return "";
    const [localPart, domainPart] = email.split("@");
    if (!domainPart) return email;

    const firstThree = localPart.slice(0, 3);
    const lastBeforeAt = localPart.length > 3 ? localPart.slice(-1) : "";
    return `${firstThree}**${lastBeforeAt}@${domainPart}`;
  };

  const displayName = formatDisplayName(user?.name, user?.email);
  const displayEmail = maskEmailForDisplay(user?.email);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setProfileMenuOpen(false);
    setUniMartDropdownOpen(false);
    setProjectFinderDropdownOpen(false);
    setStartupDropdownOpen(false);
    setTutorDropdownOpen(false);
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
      if (
        uniMartDropdownRef.current &&
        !uniMartDropdownRef.current.contains(event.target as Node)
      ) {
        setUniMartDropdownOpen(false);
      }
      if (
        projectFinderDropdownRef.current &&
        !projectFinderDropdownRef.current.contains(event.target as Node)
      ) {
        setProjectFinderDropdownOpen(false);
      }
      if (
        startupDropdownRef.current &&
        !startupDropdownRef.current.contains(event.target as Node)
      ) {
        setStartupDropdownOpen(false);
      }
      if (
        tutorDropdownRef.current &&
        !tutorDropdownRef.current.contains(event.target as Node)
      ) {
        setTutorDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`${oxanium.className} sticky top-0 z-50 border-b border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)]`}>
      <div className="mx-auto max-w-7xl px-1.5 py-2 md:px-2 lg:px-1 flex items-center justify-between">
        
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

              {/* Uni-Mart Dropdown */}
              <div className="relative" ref={uniMartDropdownRef}>
                <button
                  onClick={() => {
                    setUniMartDropdownOpen((prev) => !prev);
                    setProjectFinderDropdownOpen(false);
                    setStartupDropdownOpen(false);
                    setTutorDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-blue-600 transition text-base font-semibold text-slate-700"
                >
                  Uni-Mart
                  <ChevronDown size={16} className={`transition-transform duration-300 ${uniMartDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {uniMartDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-[500px] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-5 gap-0">
                      {/* Left Orange Section */}
                      <div className="relative col-span-2 overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 p-6 flex flex-col justify-between">
                        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/20" />
                        <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full border border-white/25" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_45%)]" />

                        <div className="relative z-10">
                          <h3 className="text-white font-bold text-xl mb-3">UNI MART</h3>
                          <p className="text-white text-sm leading-relaxed">
                            Uni Mart is the ultimate buy-and-sell hub for students.
                          </p>
                        </div>
                        <Link
                          href="/uni-mart"
                          onClick={() => setUniMartDropdownOpen(false)}
                          className="relative z-10 inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg"
                        >
                          Browse Now
                          <ChevronDown size={16} className="rotate-[-90deg]" />
                        </Link>
                      </div>

                      {/* Right White Section */}
                      <div className="col-span-3 bg-white p-6">
                        <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
                        <div className="space-y-3">
                          {uniMartQuickLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setUniMartDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon size={18} className="text-orange-400" />
                                  <span className="text-gray-800 font-semibold text-sm">{item.label}</span>
                                </div>
                                <ChevronDown size={16} className="text-orange-400 group-hover:translate-x-1 transition-transform rotate-[-90deg]" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Finder Dropdown */}
              <div className="relative" ref={projectFinderDropdownRef}>
                <button
                  onClick={() => {
                    setProjectFinderDropdownOpen((prev) => !prev);
                    setUniMartDropdownOpen(false);
                    setStartupDropdownOpen(false);
                    setTutorDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-blue-600 transition text-base font-semibold text-slate-700"
                >
                  Project Finder
                  <ChevronDown size={16} className={`transition-transform duration-300 ${projectFinderDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {projectFinderDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-[500px] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-5 gap-0">
                      <div className="relative col-span-2 overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-500 p-6 flex flex-col justify-between">
                        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/20" />
                        <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full border border-white/25" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_45%)]" />

                        <div className="relative z-10">
                          <h3 className="text-white font-bold text-xl mb-3">PROJECT FINDER</h3>
                          <p className="text-white text-sm leading-relaxed">
                            Collaborate easily by finding or forming project groups.
                          </p>
                        </div>
                        <Link
                          href="/"
                          onClick={() => setProjectFinderDropdownOpen(false)}
                          className="relative z-10 inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg"
                        >
                          Find a Group
                          <ChevronDown size={16} className="rotate-[-90deg]" />
                        </Link>
                      </div>

                      <div className="col-span-3 bg-white p-6">
                        <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
                        <div className="space-y-3">
                          {projectFinderQuickLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setProjectFinderDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-amber-50 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon size={18} className="text-amber-500" />
                                  <span className="text-gray-800 font-semibold text-sm">{item.label}</span>
                                </div>
                                <ChevronDown size={16} className="text-amber-500 group-hover:translate-x-1 transition-transform rotate-[-90deg]" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Startup Connect Dropdown */}
              <div className="relative" ref={startupDropdownRef}>
                <button
                  onClick={() => {
                    setStartupDropdownOpen((prev) => !prev);
                    setUniMartDropdownOpen(false);
                    setProjectFinderDropdownOpen(false);
                    setTutorDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-blue-600 transition text-base font-semibold text-slate-700"
                >
                  Startup Connect
                  <ChevronDown size={16} className={`transition-transform duration-300 ${startupDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {startupDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-[500px] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-5 gap-0">
                      <div className="relative col-span-2 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 flex flex-col justify-between">
                        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/20" />
                        <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full border border-white/25" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_45%)]" />

                        <div className="relative z-10">
                          <h3 className="text-white font-bold text-xl mb-3">STARTUP CONNECT</h3>
                          <p className="text-white text-sm leading-relaxed">
                            The simplest way for startups to find and hire top student talent.
                          </p>
                        </div>
                        <Link
                          href="/modules/startup-connect"
                          onClick={() => setStartupDropdownOpen(false)}
                          className="relative z-10 inline-flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg"
                        >
                          Find a Job
                          <ChevronDown size={16} className="rotate-[-90deg]" />
                        </Link>
                      </div>

                      <div className="col-span-3 bg-white p-6">
                        <h4 className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
                        <div className="space-y-3">
                          {startupQuickLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setStartupDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon size={18} className="text-blue-600" />
                                  <span className="text-gray-800 font-semibold text-sm">{item.label}</span>
                                </div>
                                <ChevronDown size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform rotate-[-90deg]" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tutor Connect Dropdown */}
              <div className="relative" ref={tutorDropdownRef}>
                <button
                  onClick={() => {
                    setTutorDropdownOpen((prev) => !prev);
                    setUniMartDropdownOpen(false);
                    setProjectFinderDropdownOpen(false);
                    setStartupDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-blue-600 transition text-base font-semibold text-slate-700"
                >
                  Tutor Connect
                  <ChevronDown size={16} className={`transition-transform duration-300 ${tutorDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {tutorDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-[500px] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-5 gap-0">
                      <div className="relative col-span-2 overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500 p-6 flex flex-col justify-between">
                        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/20" />
                        <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full border border-white/25" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_45%)]" />

                        <div className="relative z-10">
                          <h3 className="text-white font-bold text-xl mb-3">TUTOR CONNECT</h3>
                          <p className="text-white text-sm leading-relaxed">
                            Find, book, and manage expert tutors in one place.
                          </p>
                        </div>
                        <Link
                          href="/"
                          onClick={() => setTutorDropdownOpen(false)}
                          className="relative z-10 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg"
                        >
                          Find a tutor
                          <ChevronDown size={16} className="rotate-[-90deg]" />
                        </Link>
                      </div>

                      <div className="col-span-3 bg-white p-6">
                        <h4 className="text-sky-500 font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
                        <div className="space-y-3">
                          {tutorQuickLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setTutorDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-sky-50 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon size={18} className="text-sky-500" />
                                  <span className="text-gray-800 font-semibold text-sm">{item.label}</span>
                                </div>
                                <ChevronDown size={16} className="text-sky-500 group-hover:translate-x-1 transition-transform rotate-[-90deg]" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Link 
                  className="rounded-lg p-2 text-slate-700 hover:bg-white/70 hover:text-blue-600 transition" 
                  href="/messages"
                  aria-label="Messages"
                  title="Messages"
                >
                  <MessageSquare size={20} />
                </Link>
                <NotificationBell />
              </div>

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
                    <p className="max-w-[140px] truncate text-sm font-semibold text-slate-800">{displayName}</p>
                    <p className="max-w-[140px] truncate text-xs text-slate-600">{displayEmail}</p>
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

              {/* Mobile Uni-Mart Dropdown */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setUniMartDropdownOpen((prev) => !prev);
                    setProjectFinderDropdownOpen(false);
                    setStartupDropdownOpen(false);
                    setTutorDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition w-full"
                >
                  Uni-Mart
                  <ChevronDown size={16} className={`transition-transform duration-300 ${uniMartDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {uniMartDropdownOpen && (
                  <div className="mt-3 ml-4 space-y-2 bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <Link
                      href="/uni-mart"
                      onClick={() => {
                        setUniMartDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition text-center"
                    >
                      Browse Now
                    </Link>
                    {uniMartQuickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setUniMartDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 bg-white hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-orange-500" />
                            <span className="text-gray-800 font-medium text-sm">{item.label}</span>
                          </div>
                          <ChevronDown size={14} className="text-orange-500 rotate-[-90deg]" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Project Finder Dropdown */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setProjectFinderDropdownOpen((prev) => !prev);
                    setUniMartDropdownOpen(false);
                    setStartupDropdownOpen(false);
                    setTutorDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition w-full"
                >
                  Project Finder
                  <ChevronDown size={16} className={`transition-transform duration-300 ${projectFinderDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {projectFinderDropdownOpen && (
                  <div className="mt-3 ml-4 space-y-2 bg-gradient-to-br from-yellow-50 to-amber-100 p-4 rounded-lg">
                    <Link
                      href="/"
                      onClick={() => {
                        setProjectFinderDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition text-center"
                    >
                      Browse Students & Groups
                    </Link>
                    {projectFinderQuickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => {
                            setProjectFinderDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 bg-white hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-amber-500" />
                            <span className="text-gray-800 font-medium text-sm">{item.label}</span>
                          </div>
                          <ChevronDown size={14} className="text-amber-500 rotate-[-90deg]" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Startup Connect Dropdown */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setStartupDropdownOpen((prev) => !prev);
                    setUniMartDropdownOpen(false);
                    setProjectFinderDropdownOpen(false);
                    setTutorDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition w-full"
                >
                  Startup Connect
                  <ChevronDown size={16} className={`transition-transform duration-300 ${startupDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {startupDropdownOpen && (
                  <div className="mt-3 ml-4 space-y-2 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg">
                    <Link
                      href="/modules/startup-connect"
                      onClick={() => {
                        setStartupDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-4 py-2 rounded-lg transition text-center"
                    >
                      Find a Job
                    </Link>
                    {startupQuickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => {
                            setStartupDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 bg-white hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-blue-600" />
                            <span className="text-gray-800 font-medium text-sm">{item.label}</span>
                          </div>
                          <ChevronDown size={14} className="text-blue-600 rotate-[-90deg]" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Tutor Dropdown */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setTutorDropdownOpen((prev) => !prev);
                    setUniMartDropdownOpen(false);
                    setProjectFinderDropdownOpen(false);
                    setStartupDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition w-full"
                >
                  Tutor Connect
                  <ChevronDown size={16} className={`transition-transform duration-300 ${tutorDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {tutorDropdownOpen && (
                  <div className="mt-3 ml-4 space-y-2 bg-gradient-to-br from-sky-50 to-blue-100 p-4 rounded-lg">
                    <Link
                      href="/"
                      onClick={() => {
                        setTutorDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition text-center"
                    >
                      Find a tutor
                    </Link>
                    {tutorQuickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => {
                            setTutorDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 bg-white hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-sky-500" />
                            <span className="text-gray-800 font-medium text-sm">{item.label}</span>
                          </div>
                          <ChevronDown size={14} className="text-sky-500 rotate-[-90deg]" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

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
