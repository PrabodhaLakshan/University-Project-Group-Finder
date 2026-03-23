"use client";

import React, { useState } from 'react';
import { X, Plus, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const SkillsCard = () => {
 
  const [skills, setSkills] = useState(["React", "Next.js", "Tailwind CSS", "TypeScript"]);
  const [newSkill, setNewSkill] = useState("");

  // add new skill function 
  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]); 
      setNewSkill(""); // Input  clear 
    }
  };

  // Skill remove
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden h-full">
      {/* Blue Header Section */}
      <div className="bg-blue-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Skills & Expertise</h3>
        </div>
        <Badge className="bg-white/20 text-white border-none font-black">{skills.length}</Badge>
      </div>

      <div className="p-6 space-y-6">
        {/* Skills Display (Badges) */}
        <div className="flex flex-wrap gap-2 min-h-[100px] align-top content-start">
          {skills.map((skill) => (
            <Badge 
              key={skill} 
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all group border"
            >
              {skill}
              <X 
                className="w-3 h-3 cursor-pointer text-slate-400 group-hover:text-red-500 transition-colors" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-slate-400 text-xs font-bold italic">No skills added yet...</p>
          )}
        </div>

       
        <div className="pt-4 border-t border-slate-50">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Add New Skill</label>
          <div className="flex gap-2">
            <Input 
              placeholder="E.g. Python, Figma..." 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()} 
              className="rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-6 focus:border-blue-500 focus:ring-0 transition-all font-bold text-slate-700"
            />
            <Button 
              onClick={addSkill}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl w-14 h-14 shadow-lg shadow-blue-100 flex-shrink-0"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};