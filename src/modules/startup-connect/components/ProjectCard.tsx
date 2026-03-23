"use client";

import React from 'react';
import { ImageIcon, Github, ExternalLink } from "lucide-react"; // මේක වෙනස් කරන්න
import { Button } from "../../../components/ui/button";

interface ProjectProps {
  title: string;
  description: string;
  image?: string;
  githubUrl?: string; 
  demoUrl?: string;
}

export const ProjectCard = ({ title, description, image, githubUrl, demoUrl }: ProjectProps) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group h-full flex flex-col">
      {/* Image Section */}
      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-slate-300" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed font-medium flex-grow">
          {description}
        </p>
        
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="rounded-xl flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold" onClick={() => githubUrl && window.open(githubUrl, '_blank')}>
            <Github className="w-4 h-4 mr-2" /> Repo
          </Button>
          <Button size="sm" className="rounded-xl flex-1 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => demoUrl && window.open(demoUrl, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" /> Demo
          </Button>
        </div>
      </div>
    </div>
  );
};