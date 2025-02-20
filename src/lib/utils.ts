import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function facultyNum2ID(id: number) {
  const paddedId = id.toString().padStart(4, "0");
  return `F-${paddedId}`;
}

export function dependantNum2ID(id: number) {
  const paddedId = id.toString().padStart(4, "0");
  return `D-${paddedId}`;
}

export function facultyID2Num(id: string) {
  return parseInt(id.slice(2), 10);
}

export function dependantID2Num(id: string) {
  return parseInt(id.slice(2), 10);
}
