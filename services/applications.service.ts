import api from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ApplicationResponse {
    id: number;
    jobId: number;
    jobTitle: string;
    jobSlug: string;
    companyName: string;
    companyLogoUrl?: string;
    status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
    coverLetter?: string;
    appliedAt: string;
    matchScore?: number;
}

export const applicationsService = {
    async apply(jobId: number, data: { coverLetter?: string; cvUrl?: string }) {
        const res = await api.post<ApiResponse<ApplicationResponse>>(
            `/applications/job/${jobId}`,
            data
        );
        return res.data.data;
    },

    async getMyApplications(page = 0, size = 10) {
        const res = await api.get<ApiResponse<PaginatedResponse<ApplicationResponse>>>(
            `/applications/me?page=${page}&size=${size}`
        );
        return res.data.data;
    },

    async checkApplied(jobId: number): Promise<boolean> {
        const res = await api.get<ApiResponse<boolean>>(
            `/applications/check/${jobId}`
        );
        return res.data.data;
    },
};