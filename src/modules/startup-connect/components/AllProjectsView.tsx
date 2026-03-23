"use client";

import React from 'react';
import { ProjectCard } from "./ProjectCard";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, LayoutGrid, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const AllProjectsView = () => {
  const router = useRouter();

  const myProjects = [
    { 
      title: "Nexus Marketplace", 
      desc: "Campus startup platform for buying and selling.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500" // උදාහරණයක් ලෙස
    },
    { 
      title: "Portfolio Builder", 
      desc: "AI tool to generate professional student portfolios.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=500"
    },
    { 
      title: "Smart Canteen", 
      desc: "Food ordering system for university students.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=500"
    },
    { 
      title: "Skill Share", 
      desc: "Peer-to-peer learning application for networking.",
      image: "" 
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="rounded-2xl hover:bg-slate-50 font-bold text-slate-600 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">All My Projects</h2>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Showcase Gallery</p>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-100 h-10 px-5">
             <Plus className="w-4 h-4 mr-1" /> New
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myProjects.map((project, index) => (
            <div key={index} className="flex flex-col">
               <ProjectCard 
                  title={project.title} 
                  description={project.desc}
                  image={project.image} 
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};