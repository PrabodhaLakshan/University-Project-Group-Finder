import {
  BarChart3,
  LayoutDashboard,
  Settings,
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
    description: "Overview & platform health",
  },
  {
    title: "User Management",
    href: "/modules/admin/users",
    icon: Users,
    description: "Manage all user accounts",
  },
  {
    title: "Project Groups",
    href: "/modules/admin/project-group-finder",
    icon: UsersRound,
    description: "Academic teams & group control",
  },
  {
    title: "Uni Mart",
    href: "/modules/admin/uni-mart",
    icon: ShoppingBag,
    description: "Marketplace moderation",
  },
  {
    title: "Startup Connector",
    href: "/modules/admin/startup-finder",
    icon: Sparkles,
    description: "Startup profiles & gigs",
  },
  {
    title: "Tutor Finder",
    href: "/modules/admin/tutor-connect",
    icon: UserRoundSearch,
    description: "Tutors, slots & feedback",
  },
  {
    title: "Analytics",
    href: "/modules/admin/analytics",
    icon: BarChart3,
    description: "Usage & engagement stats",
  },
  {
    title: "Settings",
    href: "/modules/admin/settings",
    icon: Settings,
    description: "Admin preferences",
  },
];

export const adminBrand = {
  productName: "UniNexus Admin",
  productTagline: "Platform operations center",
};
