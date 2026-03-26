import {
  BarChart3,
  LayoutDashboard,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Users,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";

import { AdminNavItem } from "../types";

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Dashboard",
    href: "/modules/admin/dashboard",
    icon: LayoutDashboard,
    description: "Platform overview and queues",
  },
  {
    title: "Users",
    href: "/modules/admin/users",
    icon: Users,
    description: "Manage student and creator accounts",
  },
  {
    title: "Uni Mart",
    href: "/modules/admin/uni-mart",
    icon: ShoppingBag,
    description: "Marketplace listings and moderation",
  },
  {
    title: "Startup Finder",
    href: "/modules/admin/startup-finder",
    icon: Sparkles,
    description: "Startup profiles and gigs",
  },
  {
    title: "Project Groups",
    href: "/modules/admin/project-group-finder",
    icon: UsersRound,
    description: "Academic teams and group health",
  },
  {
    title: "Tutor Connect",
    href: "/modules/admin/tutor-connect",
    icon: UserRoundSearch,
    description: "Tutors, bookings, and feedback",
  },
  {
    title: "Analytics",
    href: "/modules/admin/analytics",
    icon: BarChart3,
    description: "Usage, growth, and engagement",
  },
  {
    title: "Settings",
    href: "/modules/admin/settings",
    icon: Settings,
    description: "Profile, alerts, and categories",
  },
];

export const adminBrand = {
  productName: "UniNexus Admin",
  productTagline: "Operations and trust center",
  icon: Shield,
};
