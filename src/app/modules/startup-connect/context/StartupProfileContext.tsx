"use client";

import React, { createContext, useContext, useState } from "react";

export type StartupProfile = {
  name: string;
  industry: string;
  about: string;
  // logo can be an uploaded File (client-side) or a stored URL string
  logo: File | string | null;
  // certificates can also be Files or URL strings
  certificates: (File | string)[];
};

type StartupProfileContextValue = {
  profile: StartupProfile | null;
  setProfile: (profile: StartupProfile | null) => void;
};

const StartupProfileContext = createContext<StartupProfileContextValue | undefined>(undefined);

export function StartupProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<StartupProfile | null>(null);

  return (
    <StartupProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </StartupProfileContext.Provider>
  );
}

export function useStartupProfile() {
  const ctx = useContext(StartupProfileContext);
  if (!ctx) {
    throw new Error("useStartupProfile must be used within StartupProfileProvider");
  }
  return ctx;
}
