"use client";
import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Rocket, Bell, LogOut, Menu, X } from "lucide-react";
import { STARTUP_DASHBOARD_LINKS, STARTUP_LANDING_LINKS, STARTUP_LINKS } from '../constants/navigation';
import { NotificationDropdown } from './NotificationDropdown';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  type AppNotification,
} from '../services/notification.service';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationContainerRef = useRef<HTMLDivElement | null>(null);
  const notificationMenuId = useId();

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadNotifications();
    const intervalId = setInterval(loadNotifications, 15000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!notificationContainerRef.current) {
        return;
      }

      if (!notificationContainerRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const onEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', onEscClose);
    return () => document.removeEventListener('keydown', onEscClose);
  }, []);

  useEffect(() => {
    setShowNotifications(false);
  }, [pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch {
      // Keep UI state unchanged if request fails.
    }
  };

  // 1. Navbar එක පෙන්විය යුතු පේජ් එකකද ඉන්නේ කියලා බලන Logic එක
  const isStartupConnectPage = pathname.includes('/startup-connect') ||
                               pathname.includes('/dashboard/student') ||
                               pathname.includes('/dashboard/startup');

  // වැදගත්: Startup Connect අදාළ පේජ් එකක නෙවෙයි නම් මුකුත් පෙන්වන්න එපා
  if (!isStartupConnectPage) {
    return null;
  }

  // Determine which links to show based on current route
  const isStartupDashboardRoute =
    pathname.startsWith('/startup-connect/talent-pool') ||
    pathname.startsWith('/startup-connect/dashboard') ||
    pathname.startsWith('/startup-connect/applicants') ||
    pathname.startsWith('/dashboard/startup');
  const startupLandingNavbarRoutes = ['/startup-connect', '/startup-connect/about', '/startup-connect/browse-gigs', '/startup-connect/my-projects'];
  const startupStaticRoutes = new Set([
    'about',
    'applicants',
    'browse-gigs',
    'dashboard',
    'my-projects',
    'notifications',
    'talent-pool',
  ]);
  const pathSegments = pathname.split('/').filter(Boolean);
  const isDynamicCompanyDetailsRoute =
    pathSegments[0] === 'startup-connect' &&
    Boolean(pathSegments[1]) &&
    !startupStaticRoutes.has(pathSegments[1]);
  const isStartupLandingPage = startupLandingNavbarRoutes.includes(pathname) || isDynamicCompanyDetailsRoute;
  const activeLinks = isStartupLandingPage
    ? STARTUP_LANDING_LINKS
    : isStartupDashboardRoute
      ? STARTUP_DASHBOARD_LINKS
      : STARTUP_LINKS;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between md:justify-start">
        <Link href="/" className="flex items-center group">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none tracking-tight">UniNexus</span>
            <span className="text-[10px] font-bold text-sky-600 tracking-tighter uppercase">
              FounderPortal
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {activeLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-tighter transition-all duration-200 ${
                isActive
                  ? "bg-sky-50 text-sky-700 border border-sky-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-sky-600 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex items-center gap-3 pt-6">
        <div ref={notificationContainerRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            aria-haspopup="menu"
            aria-expanded={showNotifications}
            aria-controls={notificationMenuId}
            title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
            onClick={() => {
              if (!showNotifications) {
                void loadNotifications();
              }
              setShowNotifications((prev) => !prev);
            }}
            className={`group relative rounded-xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 ${
              showNotifications
                ? 'bg-sky-100 text-sky-600'
                : 'text-slate-400 hover:text-sky-600 hover:bg-sky-50'
            }`}
          >
            <Bell className={`w-5 h-5 transition-transform duration-200 ${unreadCount > 0 ? 'group-hover:-rotate-12' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {showNotifications && (
            <div id={notificationMenuId} role="menu" className="absolute left-0 bottom-14 z-50 md:left-full md:bottom-0 md:ml-3">
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllRead={handleMarkAllRead}
              />
            </div>
          )}
        </div>

      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-x-0 top-16 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center shadow-md shadow-sky-100">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-black text-slate-900 tracking-tight">UniNexus</span>
        </Link>

        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-72 border-r border-slate-200 bg-white px-5 py-6 md:flex md:flex-col">
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-900/40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!sidebarOpen}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
