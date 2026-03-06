export type GroupStatus = "NO_GROUP" | "PENDING" | "IN_GROUP";

export type ProfileProject = {
  id: string;
  name: string;
  description: string;
  tech: string[];          // ["Next.js","Prisma"]
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;       // base64 data URL or remote URL
  updatedAt?: string;      // "2 days ago"
};

export type Mark = {
  moduleCode: string;      // IT3020
  moduleName: string;      // Database Systems
  grade: string;           // A / B+
  marks: number;           // 85
  semester?: string;       // Y3S2
};

export type ResultSheetState = {
  fileName?: string;
  status: "EMPTY" | "PENDING" | "VERIFIED" | "REJECTED";
  allMarks: Mark[];
  publishedMarks: Mark[];  // only selected ones to save in DB
  gpa?: string | null;     // Extracted cumulative GPA
  publishGpa?: boolean;    // User toggled selection
};

export type StudentProfile = {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  imageUrl?: string;

  bio?: string;
  mobile?: string;
  githubUrl?: string;
  groupStatus: GroupStatus;
  linkedinUrl?: string;
  skills: string[];

  projects: ProfileProject[];
  resultSheet: ResultSheetState;
};