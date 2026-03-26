import { LucideIcon } from "lucide-react";

export type AdminStatus =
  | "Active"
  | "Suspended"
  | "Pending"
  | "Reported"
  | "Approved"
  | "Rejected";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type SummaryMetric = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  tone?: "blue" | "purple" | "orange" | "gold";
};

export type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  cta: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  status?: AdminStatus;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Tutor" | "Startup" | "Seller" | "Admin";
  status: AdminStatus;
  joinedDate: string;
};

export type MarketplacePost = {
  id: string;
  itemTitle: string;
  seller: string;
  category: string;
  price: string;
  status: AdminStatus;
  reports: number;
};

export type StartupProfile = {
  id: string;
  name: string;
  founder: string;
  domain: string;
  gigs: number;
  verificationStatus: AdminStatus;
  status: AdminStatus;
};

export type GroupRecord = {
  id: string;
  topic: string;
  leader: string;
  memberCount: number;
  status: AdminStatus;
  stage: string;
};

export type TutorRecord = {
  id: string;
  name: string;
  subject: string;
  rating: string;
  bookings: number;
  waitlist: number;
  status: AdminStatus;
};

export type ReportRecord = {
  id: string;
  targetType: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: AdminStatus;
};

export type VerificationRecord = {
  id: string;
  name: string;
  module: string;
  submittedAt: string;
  status: AdminStatus;
  priority: "Low" | "Medium" | "High";
};

export type ModuleUsageStat = {
  module: string;
  activeUsers: string;
  conversion: string;
  satisfaction: string;
};

export type FilterOption = {
  label: string;
  value: string;
};
