"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

const MyProjectsPage = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "EcoTrack Mobile App",
      description: "A sustainable lifestyle tracking app built with React Native.",
      github: "https://github.com",
      demo: "https://demo.com",
      date: "Feb 2026",
      images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070"]
    }
  ]);

  const handleAddProject = (newProject: any) => {
    setProjects([newProject, ...projects]);
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/startup-connect/browse-gigs"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={14} /> Back to Browse Gigs
        </Link>
        
        {/* Header */}
        <div className="mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tight">
              Our Recent Projects
            </h1>
            <p className="text-slate-500 font-bold mt-1">
              We are proud to showcase our latest innovations and collaborations in the startup ecosystem. Each project reflects our commitment to creativity, impact, and excellence.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-sky-100/50 transition-all group">
              <div className="aspect-video rounded-[30px] overflow-hidden mb-6">
                <img src={project.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-900 italic">{project.title}</h2>
                  <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500">{project.date}</span>
                </div>
                <p className="text-slate-500 font-bold text-sm italic line-clamp-2">"{project.description}"</p>
                
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="rounded-xl border-slate-200 font-bold flex-1">
                    <Github className="w-4 h-4 mr-2" /> Code
                  </Button>
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex-1">
                    Live Demo <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjectsPage;