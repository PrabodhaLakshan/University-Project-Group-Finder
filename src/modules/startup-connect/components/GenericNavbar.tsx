"use client";
import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Rocket, User } from "lucide-react";
import { NotificationDropdown } from './NotificationDropdown';
import type { AppNotification } from '../services/notification.service';

export const GenericNavbar = ({ links, portalName, showExit = true }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const notificationContainerRef = useRef<HTMLDivElement | null>(null);
  const notificationMenuId = useId();
  
  // Notification States
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const mockNotifications: AppNotification[] = [
      {
        id: '1',
        title: 'New Gig Match!',
        message: 'A new UI Design project matches your skills.',
        time: new Date(),
        read: false,
        type: 'match',
      },
      {
        id: '2',
        title: 'Application Viewed',
        message: 'StartupX viewed your application for Frontend Dev.',
        time: new Date(Date.now() - 3600000),
        read: true,
        type: 'status',
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(1);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!notificationContainerRef.current) {
        return;
      }

      if (!notificationContainerRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    };

    const onEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotif(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscClose);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscClose);
    };
  }, []);

  useEffect(() => {
    setShowNotif(false);
  }, [pathname]);

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Link href="/startup-connect" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="flex flex-col uppercase font-black italic tracking-tighter">
              <span className="text-lg text-slate-900 leading-none">UniNexus</span>
              <span className="text-[10px] text-sky-600">{portalName}</span>
            </div>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          {/* Bell Notification Logic */}
          <div ref={notificationContainerRef} className="relative z-100"> 
            <button
              type="button"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              aria-haspopup="menu"
              aria-expanded={showNotif}
              aria-controls={notificationMenuId}
              title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
              onClick={() => setShowNotif((prev) => !prev)}
              className={`group p-3 rounded-2xl transition-all duration-200 active:scale-95 relative z-110 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 
                ${showNotif ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 hover:bg-sky-50 text-slate-500'}
              `}
            >
              <Bell size={20} className={`pointer-events-none stroke-[2.5px] transition-transform duration-200 ${unreadCount > 0 ? 'group-hover:-rotate-12' : ''}`} />
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-orange-500 text-white rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center pointer-events-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown එක පෙන්වන තැන */}
            {showNotif && (
              <div id={notificationMenuId} role="menu" className="absolute top-14 right-0 z-120 min-w-[320px] drop-shadow-2xl">
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllRead={handleMarkAllRead}
                />
              </div>
            )}
          </div>

          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <User size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};