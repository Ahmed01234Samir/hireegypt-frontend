export type UserRole = "SEEKER" | "EMPLOYER" | "ADMIN";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    cvUrl?: string;
    phone?: string;
    location?: string;
    bio?: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    role: UserRole;
    userId: number;
    name: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}