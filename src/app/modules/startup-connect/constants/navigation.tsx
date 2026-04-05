import { Home, User, LayoutGrid, Rocket, Star, CircleHelp, Users, Briefcase, HeartHandshake } from "lucide-react";

export const STARTUP_LANDING_LINKS = [
  { name: "Home", href: "/startup-connect", icon: Home },
  { name: "How it Works", href: "/startup-connect/about", icon: CircleHelp },
  { name: "Browse Gigs", href: "/startup-connect/browse-gigs", icon: Rocket },
  { name: "Work & reviews", href: "/startup-connect/my-collaborations", icon: HeartHandshake },
];

// Startup අයට අදාළ Links
export const STARTUP_LINKS = [
  { name: "Dashboard", href: "/startup-connect", icon: Home },
  { name: "My Projects", href: "/startup-connect/my-projects", icon: LayoutGrid },
  { name: "Work & reviews", href: "/startup-connect/my-collaborations", icon: HeartHandshake },
  { name: "Reviews", href: "/dashboard/startup", icon: Star },
];

export const STARTUP_DASHBOARD_LINKS = [
  { name: "Account", href: "/startup-connect/dashboard", icon: User },
  { name: "Talent Pool", href: "/startup-connect/talent-pool", icon: Users },
  { name: "Applications", href: "/startup-connect/applicants", icon: Briefcase },
  { name: "Reviews", href: "/dashboard/startup", icon: Star },
];