import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function alumniNum2ID(id: number) {
  const paddedId = id.toString().padStart(4, "0");
  return `A-${paddedId}`;
}
export function alumniID2Num(id: string) {
  return parseInt(id.slice(2), 10);
}
