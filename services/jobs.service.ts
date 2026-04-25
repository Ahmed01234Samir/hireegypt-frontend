import api from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Job, JobFilters } from "@/types/job";

export const jobsService = {
    async getJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
        const params = new URLSearchParams();
        if (filters.keyword) params.append("keyword", filters.keyword);
        if (filters.location) params.append("location", filters.location);
        if (filters.jobType) params.append("jobType", filters.jobType);
        if (filters.experienceLevel) params.append("experienceLevel", filters.experienceLevel);
        if (filters.isRemote !== undefined) params.append("isRemote", String(filters.isRemote));
        if (filters.page !== undefined) params.append("page", String(filters.page));
        if (filters.size !== undefined) params.append("size", String(filters.size));

        const res = await api.get<ApiResponse<PaginatedResponse<Job>>>(`/jobs?${params}`);
        return res.data.data;
    },

    async getJob(slug: string): Promise<Job> {
        const res = await api.get<ApiResponse<Job>>(`/jobs/${slug}`);
        return res.data.data;
    },
};