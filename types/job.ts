export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
export type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "LEAD";
export type JobStatus = "ACTIVE" | "CLOSED" | "DRAFT";
export type ApplicationStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";

export interface Skill {
    id: number;
    name: string;
}

export interface JobCompany {
    id: number;
    slug: string;
    name: string;
    logoUrl?: string;
    location?: string;
    industry?: string;
}

export interface Job {
    id: number;
    slug: string;
    title: string;
    description: string;
    requirements?: string;
    benefits?: string;
    location?: string;
    isRemote: boolean;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency: string;
    status: JobStatus;
    viewsCount: number;
    deadline?: string;
    postedAt: string;
    skills: Skill[];
    company: JobCompany;
}

export interface JobFilters {
    keyword?: string;
    location?: string;
    jobType?: JobType;
    experienceLevel?: ExperienceLevel;
    isRemote?: boolean;
    page?: number;
    size?: number;
}