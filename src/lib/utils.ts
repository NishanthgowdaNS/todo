import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRisk(score: number) {
  return Math.round(score);
}

export function getRiskColor(classification: string) {
  switch (classification) {
    case 'High Risk': return 'text-red-500 bg-red-50 border-red-200';
    case 'Medium Risk': return 'text-amber-500 bg-amber-50 border-amber-200';
    default: return 'text-emerald-500 bg-emerald-50 border-emerald-200';
  }
}
