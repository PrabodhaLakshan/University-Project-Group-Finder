import {
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Flag,
  ShoppingBag,
  UserCog,
} from "lucide-react";

import {
  ActivityItem,
  GroupRecord,
  MarketplacePost,
  ModuleUsageStat,
  QuickAction,
  ReportRecord,
  StartupProfile,
  SummaryMetric,
  TutorRecord,
  UserRecord,
  VerificationRecord,
} from "../types";

export const dashboardMetrics: SummaryMetric[] = [
  { title: "Total users", value: "18,420", change: "+8.4% this month", trend: "up", icon: UserCog, tone: "blue" },
  { title: "Active listings", value: "642", change: "+41 today", trend: "up", icon: ShoppingBag, tone: "orange" },
  { title: "Startups", value: "138", change: "+6 pending review", trend: "up", icon: BriefcaseBusiness, tone: "purple" },
  { title: "Tutors", value: "94", change: "12 on waitlist", trend: "neutral", icon: BookOpenCheck, tone: "gold" },
  { title: "Bookings", value: "1,286", change: "+12.1% week over week", trend: "up", icon: BadgeCheck, tone: "blue" },
  { title: "Reports", value: "27", change: "-3 since yesterday", trend: "down", icon: Flag, tone: "orange" },
];

export const quickActions: QuickAction[] = [
  {
    title: "Review reported posts",
    description: "Clear high-priority marketplace and tutor abuse reports.",
    href: "/modules/admin/reports",
    icon: Flag,
    cta: "Open queue",
  },
  {
    title: "Process verifications",
    description: "Approve founders, tutors, and group leaders awaiting checks.",
    href: "/modules/admin/verifications",
    icon: BadgeCheck,
    cta: "Review requests",
  },
  {
    title: "Inspect Uni Mart listings",
    description: "Moderate suspicious listings and resolve seller disputes.",
    href: "/modules/admin/uni-mart",
    icon: ShoppingBag,
    cta: "Moderate posts",
  },
];

export const recentActivities: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Laptop listing hidden",
    description: "A moderator removed a repeated scam report from Uni Mart.",
    time: "8 minutes ago",
    status: "Reported",
  },
  {
    id: "activity-2",
    title: "Startup verified",
    description: "GreenGrid Labs completed its founder verification flow.",
    time: "23 minutes ago",
    status: "Approved",
  },
  {
    id: "activity-3",
    title: "Tutor suspended",
    description: "Missed-session policy triggered a temporary suspension.",
    time: "52 minutes ago",
    status: "Suspended",
  },
  {
    id: "activity-4",
    title: "New group reported",
    description: "AI capstone group flagged for duplicate topic submissions.",
    time: "1 hour ago",
    status: "Pending",
  },
];

export const users: UserRecord[] = [
  { id: "u1", name: "Nadun Perera", email: "nadun@uninexus.edu", role: "Student", status: "Active", joinedDate: "2026-01-12" },
  { id: "u2", name: "Ayesha Fernando", email: "ayesha@uninexus.edu", role: "Tutor", status: "Pending", joinedDate: "2026-02-04" },
  { id: "u3", name: "Kavi Labs", email: "hello@kavilabs.io", role: "Startup", status: "Approved", joinedDate: "2025-12-18" },
  { id: "u4", name: "Tharushi Silva", email: "tharushi@unimart.lk", role: "Student", status: "Reported", joinedDate: "2026-02-27" },
  { id: "u5", name: "Admin Ops", email: "ops@uninexus.edu", role: "Admin", status: "Active", joinedDate: "2025-10-02" },
  { id: "u6", name: "Ravin Jayasekara", email: "ravin@uninexus.edu", role: "Student", status: "Suspended", joinedDate: "2026-01-21" },
];

export const marketplacePosts: MarketplacePost[] = [
  { id: "m1", itemTitle: "MacBook Air M2", seller: "Tharindu K.", category: "Electronics", price: "LKR 285,000", status: "Active", reports: 0 },
  { id: "m2", itemTitle: "Architecture Drawing Kit", seller: "Shenali D.", category: "Supplies", price: "LKR 8,500", status: "Pending", reports: 1 },
  { id: "m3", itemTitle: "iPhone 13 Pro", seller: "Kusal M.", category: "Phones", price: "LKR 180,000", status: "Reported", reports: 4 },
  { id: "m4", itemTitle: "Data Science Textbook Set", seller: "Rashmi S.", category: "Books", price: "LKR 14,000", status: "Approved", reports: 0 },
  { id: "m5", itemTitle: "Gaming Chair", seller: "Dilan P.", category: "Furniture", price: "LKR 32,000", status: "Suspended", reports: 2 },
];

export const startupProfiles: StartupProfile[] = [
  { id: "s1", name: "GreenGrid Labs", founder: "Amal Wijesinghe", domain: "Climate Tech", gigs: 12, verificationStatus: "Approved", status: "Active" },
  { id: "s2", name: "Finpilot", founder: "Iresha De Soysa", domain: "Fintech", gigs: 7, verificationStatus: "Pending", status: "Pending" },
  { id: "s3", name: "MediFlow", founder: "Kalin Rodrigo", domain: "HealthTech", gigs: 4, verificationStatus: "Reported", status: "Reported" },
  { id: "s4", name: "SkillForge", founder: "Dinuki S.", domain: "EdTech", gigs: 16, verificationStatus: "Approved", status: "Active" },
];

export const groups: GroupRecord[] = [
  { id: "g1", topic: "Smart Campus Energy Monitor", leader: "Navin Liyanage", memberCount: 5, status: "Active", stage: "Proposal" },
  { id: "g2", topic: "AI Resume Analyzer", leader: "Hasini Perera", memberCount: 4, status: "Pending", stage: "Matching" },
  { id: "g3", topic: "AR Lab Assistant", leader: "Shehan Dias", memberCount: 6, status: "Approved", stage: "Development" },
  { id: "g4", topic: "Waste Sorting Robot", leader: "Sajini Fonseka", memberCount: 3, status: "Reported", stage: "Review" },
];

export const tutors: TutorRecord[] = [
  { id: "t1", name: "Minoli Jayasooriya", subject: "Calculus", rating: "4.9", bookings: 92, waitlist: 14, status: "Active" },
  { id: "t2", name: "Rashan Peris", subject: "Java Programming", rating: "4.7", bookings: 80, waitlist: 9, status: "Approved" },
  { id: "t3", name: "Amani Hettiarachchi", subject: "UI/UX Design", rating: "4.8", bookings: 58, waitlist: 12, status: "Pending" },
  { id: "t4", name: "Dulaj Fernando", subject: "Physics", rating: "4.2", bookings: 33, waitlist: 4, status: "Suspended" },
];

export const reports: ReportRecord[] = [
  { id: "r1", targetType: "Uni Mart listing", reportedBy: "Nethmi K.", reason: "Suspected scam", date: "2026-03-23", status: "Pending" },
  { id: "r2", targetType: "Tutor profile", reportedBy: "Sahan R.", reason: "Missed paid session", date: "2026-03-22", status: "Reported" },
  { id: "r3", targetType: "Startup profile", reportedBy: "Admin bot", reason: "Document mismatch", date: "2026-03-22", status: "Rejected" },
  { id: "r4", targetType: "Project group", reportedBy: "Faculty reviewer", reason: "Duplicate proposal", date: "2026-03-21", status: "Approved" },
];

export const verifications: VerificationRecord[] = [
  { id: "v1", name: "GreenGrid Labs", module: "Startup Finder", submittedAt: "2026-03-24 08:15", status: "Pending", priority: "High" },
  { id: "v2", name: "Minoli Jayasooriya", module: "Tutor Connect", submittedAt: "2026-03-24 07:40", status: "Approved", priority: "Medium" },
  { id: "v3", name: "AI Resume Analyzer", module: "Project Group Finder", submittedAt: "2026-03-23 19:20", status: "Pending", priority: "High" },
  { id: "v4", name: "Finpilot", module: "Startup Finder", submittedAt: "2026-03-23 18:05", status: "Rejected", priority: "Low" },
];

export const moduleUsageStats: ModuleUsageStat[] = [
  { module: "Uni Mart", activeUsers: "6,920", conversion: "14.3%", satisfaction: "4.7/5" },
  { module: "Startup Finder", activeUsers: "2,180", conversion: "9.6%", satisfaction: "4.5/5" },
  { module: "Project Group Finder", activeUsers: "4,410", conversion: "18.1%", satisfaction: "4.6/5" },
  { module: "Tutor Connect", activeUsers: "3,290", conversion: "11.8%", satisfaction: "4.8/5" },
];

export const bookingSummary: SummaryMetric[] = [
  { title: "Confirmed bookings", value: "486", change: "+22 today", trend: "up", icon: BookOpenCheck, tone: "blue" },
  { title: "Waitlist requests", value: "74", change: "+8 unresolved", trend: "neutral", icon: UserCog, tone: "orange" },
  { title: "Average rating", value: "4.8", change: "Across all tutors", trend: "up", icon: BadgeCheck, tone: "purple" },
];

export const pendingReports = reports.filter((report) => report.status === "Pending" || report.status === "Reported");
export const pendingVerifications = verifications.filter((verification) => verification.status === "Pending");
