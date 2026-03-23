"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApplyGigModal } from './ApplyGigModal';
import { COMPANY_DETAILS } from '../constants/company-details';

const MOCK_GIGS = [
  { id: 1, title: "Next.js Developer Needed", startup: "TechFlow", startupId: "startup-techflow", category: "Development", budget: "LKR 15,000", type: "Remote", level: "Intermediate" },
  { id: 2, title: "Social Media Graphics", startup: "CreativeX", startupId: "startup-creativex", category: "Design", budget: "LKR 5,000", type: "Remote", level: "Beginner" },
  { id: 3, title: "Python Data Scripting", startup: "DataMind", startupId: "startup-datamind", category: "Data Science", budget: "LKR 20,000", type: "Remote", level: "Advanced" },
  { id: 4, title: "Mobile App UI Revamp", startup: "CreativeX", startupId: "startup-creativex", category: "UI/UX", budget: "LKR 12,000", type: "Remote", level: "Intermediate" },
  { id: 5, title: "Node.js API Integration", startup: "TechFlow", startupId: "startup-techflow", category: "Backend", budget: "LKR 18,000", type: "Remote", level: "Advanced" },
  { id: 6, title: "Startup Promo Video Editing", startup: "CreativeX", startupId: "startup-creativex", category: "Multimedia", budget: "LKR 7,500", type: "Remote", level: "Beginner" },
  { id: 7, title: "SQL Dashboard Automation", startup: "DataMind", startupId: "startup-datamind", category: "Analytics", budget: "LKR 16,000", type: "Remote", level: "Intermediate" },
  { id: 8, title: "Campus Brand Ambassador Campaign", startup: "TechFlow", startupId: "startup-techflow", category: "Marketing", budget: "LKR 6,000", type: "Remote", level: "Beginner" },
  { id: 9, title: "React Component Library Setup", startup: "TechFlow", startupId: "startup-techflow", category: "Frontend", budget: "LKR 14,500", type: "Remote", level: "Intermediate" },
  { id: 10, title: "AI Chatbot Prompt Tuning", startup: "DataMind", startupId: "startup-datamind", category: "AI/ML", budget: "LKR 22,000", type: "Remote", level: "Advanced" },
  { id: 11, title: "SEO Content Calendar Planning", startup: "CreativeX", startupId: "startup-creativex", category: "Content", budget: "LKR 8,500", type: "Remote", level: "Beginner" },
  { id: 12, title: "QA Testing for Student Portal", startup: "TechFlow", startupId: "startup-techflow", category: "Quality Assurance", budget: "LKR 9,000", type: "Remote", level: "Intermediate" },
  { id: 13, title: "Java Spring Boot API Development", startup: "TechFlow", startupId: "startup-techflow", category: "Backend", budget: "LKR 19,500", type: "Remote", level: "Advanced" },
];

export const BrowseGigsView = () => {
  const [selectedGig, setSelectedGig] = useState<(typeof MOCK_GIGS)[number] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const categories = ['All', ...Array.from(new Set(MOCK_GIGS.map((gig) => gig.category)))];
  const types = ['All', ...Array.from(new Set(MOCK_GIGS.map((gig) => gig.type)))];
  const levels = ['All', ...Array.from(new Set(MOCK_GIGS.map((gig) => gig.level)))];

  const filteredGigs = MOCK_GIGS.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
    const matchesType = selectedType === 'All' || gig.type === selectedType;
    const matchesLevel = selectedLevel === 'All' || gig.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesType && matchesLevel;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedLevel('All');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto mt-20 bg-white">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic text-slate-900 tracking-tighter uppercase leading-none">
            Find Your Next <span className="text-blue-700">Gig</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest italic">Browse projects from top campus startups</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by Skill or Startup..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 rounded-2xl border-slate-100 bg-white shadow-sm font-bold text-xs"
            />
          </div>
          <Button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            variant="outline"
            className="rounded-2xl py-6 px-6 border-blue-100 bg-white hover:bg-blue-50"
          >
            <Filter size={18} className="text-blue-700" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-5 rounded-3xl border border-slate-100 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
            >
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <Button
              type="button"
              onClick={clearFilters}
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-xs font-black uppercase"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGigs.map((gig) => (
          <div key={gig.id} className="group bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-100/40 hover:shadow-blue-100 transition-all hover:-translate-y-2 border-b-4 border-b-blue-100 hover:border-b-orange-500">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-50 text-blue-700 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
                {gig.category}
              </div>
              <span className="text-orange-500 font-black text-[10px] uppercase italic">{gig.type}</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 uppercase leading-tight mb-2 group-hover:text-blue-700 transition-colors">
              {gig.title}
            </h3>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-6 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1">
                Company:
                <Link
                  href={`/startup-connect/${gig.startupId}`}
                  className="text-slate-600 underline cursor-pointer hover:text-blue-700 transition-colors"
                >
                  {gig.startup}
                </Link>
              </p>
              <span className="w-10 h-10 rounded-2xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                {COMPANY_DETAILS[gig.startupId]?.logoUrl ? (
                  <img
                    src={COMPANY_DETAILS[gig.startupId].logoUrl}
                    alt={`${gig.startup} logo`}
                    className="w-7 h-7 object-contain"
                  />
                ) : (
                  <span className="text-sm font-black text-slate-500">{gig.startup.charAt(0)}</span>
                )}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <DollarSign size={14} className="text-blue-700" /> {gig.budget}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Clock size={14} className="text-orange-500" /> 3 days left
              </div>
            </div>

            <Button 
              onClick={() => setSelectedGig(gig)}
              className="w-full bg-blue-50 hover:bg-orange-500 text-blue-700 hover:text-white rounded-2xl py-6 font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Apply Now <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        ))}
      </div>

      {filteredGigs.length === 0 && (
        <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 px-6 py-8 text-center">
          <p className="text-sm font-black text-slate-700 uppercase tracking-widest">No gigs found</p>
          <p className="text-xs font-bold text-slate-400 mt-2">Try changing filters or search terms.</p>
        </div>
      )}

      {selectedGig && (
        <ApplyGigModal
          gigTitle={selectedGig.title}
          startupName={selectedGig.startup}
          startupId={selectedGig.startupId}
          onClose={() => setSelectedGig(null)}
        />
      )}
    </div>
  );
};