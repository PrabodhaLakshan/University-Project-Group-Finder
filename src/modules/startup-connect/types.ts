export interface StartupGig {
  id: string;
  title: string;
  description?: string;
  required_skills: string[];
  budget: string;
  duration: string;
  founder_name: string;
  match_score?: number;
}