export type CompanyReview = {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
};

export type CompanyDetails = {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  location: string;
  about: string;
  reviews: CompanyReview[];
};

export const COMPANY_DETAILS: Record<string, CompanyDetails> = {
  "startup-techflow": {
    id: "startup-techflow",
    name: "TechFlow",
    logoUrl: "/next.svg",
    industry: "Software Development",
    location: "Colombo",
    about: "Product-focused startup building web and mobile tools for campus operations.",
    reviews: [
      { id: 1, customer: "Amara Perera", rating: 5, comment: "Very supportive team and clear requirements.", date: "2 months ago" },
      { id: 2, customer: "Dulanjan Silva", rating: 4, comment: "Great communication and on-time feedback.", date: "4 months ago" },
    ],
  },
  "startup-creativex": {
    id: "startup-creativex",
    name: "CreativeX",
    logoUrl: "/vercel.svg",
    industry: "Design & Branding",
    location: "Kandy",
    about: "Creative studio helping early startups with branding, social media, and content design.",
    reviews: [
      { id: 1, customer: "Sahan Gunawardena", rating: 5, comment: "Friendly team and smooth workflow.", date: "1 month ago" },
      { id: 2, customer: "Tharushi Nethmini", rating: 4, comment: "Good project scope and quick approvals.", date: "3 months ago" },
    ],
  },
  "startup-datamind": {
    id: "startup-datamind",
    name: "DataMind",
    logoUrl: "/globe.svg",
    industry: "Data Science",
    location: "Galle",
    about: "Analytics startup delivering reporting and automation for small and medium businesses.",
    reviews: [
      { id: 1, customer: "Nipun Ranasinghe", rating: 5, comment: "Excellent mentorship and practical tasks.", date: "3 weeks ago" },
      { id: 2, customer: "Nadeesha Fernando", rating: 4, comment: "Well-structured projects and fair timelines.", date: "2 months ago" },
    ],
  },
};