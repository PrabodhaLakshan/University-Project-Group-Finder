"use client";

import React, { createContext, useContext, useState } from "react";

export type StartupProfile = {
  name: string;
  industry: string;
  about: string;
  logo: File | null;
  certificates: File[];
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
