import portfolioData from "@/data/portfolio.json";
import type { PortfolioData, PortfolioProject, ProjectMediaItem } from "@/data/types";

export const portfolio = portfolioData as PortfolioData;

export function getProjectById(id: number): PortfolioProject | null {
  return portfolio.projects.find((p) => p.id === id) ?? null;
}

export type { ProjectMediaItem, PortfolioProject };
