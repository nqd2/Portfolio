export type LangCode = "vi" | "en" | "jp";

export interface PortfolioProfile {
  name: string;
  fullName: string;
  education: string;
  location: string;
  languages: string;
  profileImage: string;
  profileImageLabel: string;
}

export interface PortfolioSkill {
  name: string;
  subtitle?: string;
  icon?: string;
}

export type ProjectMediaItem =
  | string
  | { type: "youtube"; src: string; caption?: string }
  | { type: "video"; src: string; caption?: string };


export interface PortfolioProject {
  id: number;
  title: string;
  category: string;
  year: string;
  images?: string[];
  media?: ProjectMediaItem[];
}

export interface ContactItem {
  type: string;
  label: string;
  url: string;
}

export interface WhatIDo {
  text: string;
  highlights: string[];
}

export interface PortfolioData {
  profile: PortfolioProfile;
  whatIDo?: WhatIDo;
  skills: PortfolioSkill[];
  projects: PortfolioProject[];
  contact: ContactItem[];
}

export type Translations = Record<string, string | Record<string, string>>;
