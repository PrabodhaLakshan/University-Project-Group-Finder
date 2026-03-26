"use client";

import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Edit3, Sparkles } from "lucide-react";

export const AboutSection = () => {
 
  const [aboutText, setAboutText] = useState(
    "I'm a passionate Full Stack Developer with over 3 years of experience in building scalable web applications. I love working with React, Next.js, and Node.js to create seamless user experiences."
  );
  
  const [tempText, setTempText] = useState(aboutText); 
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setAboutText(tempText);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 relative group overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <User className="w-32 h-32 text-slate-900" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">About Me</h3>
          </div>

          {/* Edit Button - Modal Trigger */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all"
                onClick={() => setTempText(aboutText)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-xl bg-white rounded-[40px] border-none shadow-2xl p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-slate-900 italic uppercase">Edit Bio</DialogTitle>
              </DialogHeader>
              
              <div className="py-6">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2 block tracking-widest">Your Story</label>
                <Textarea 
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="rounded-3xl border-slate-100 min-h-45 focus:ring-indigo-500 font-bold p-6 text-slate-600 leading-relaxed"
                />
              </div>

              <DialogFooter className="gap-3">
                <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-2xl font-bold text-slate-400">Cancel</Button>
                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 font-black shadow-lg shadow-indigo-100">
                  SAVE CHANGES
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Display Text */}
        <p className="text-slate-500 font-bold text-lg leading-relaxed italic pr-10">
          "{aboutText}"
        </p>
      </div>
    </div>
  );
};