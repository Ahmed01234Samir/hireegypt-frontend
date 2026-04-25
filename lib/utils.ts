import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatSalary(min?: number, max?: number, currency = "EGP") {
    if (!min && !max) return "Salary not disclosed";
    const fmt = (n: number) => n.toLocaleString("en-EG");
    if (min && max) return `${currency} ${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${currency} ${fmt(min)}`;
    return `Up to ${currency} ${fmt(max!)}`;
}

export function timeAgo(date: string | Date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export function slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}