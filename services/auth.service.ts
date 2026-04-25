import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
        return res.data.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
        return res.data.data;
    },

    async logout(): Promise<void> {
        await api.post("/auth/logout");
    },
};