import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function dateToWords(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const fullYear = year < 100 ? 2000 + year : year; // Adjust for 2-digit year

  const date = new Date(fullYear, month - 1, day);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
