import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { LoginRequest, RegisterRequest } from "@/types/auth";

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user, isAuthenticated, accessToken } = useSelector(
        (state: RootState) => state.auth
    );

    async function login(data: LoginRequest) {
        const response = await authService.login(data);
        dispatch(
            setCredentials({
                user: {
                    id: response.userId,
                    name: response.name,
                    email: response.email,
                    role: response.role,
                },
                accessToken: response.accessToken,
            })
        );
        // Redirect based on role
        if (response.role === "EMPLOYER") {
            router.push("/dashboard/employer");
        } else {
            router.push("/dashboard/seeker");
        }
    }

    async function register(data: RegisterRequest) {
        const response = await authService.register(data);
        dispatch(
            setCredentials({
                user: {
                    id: response.userId,
                    name: response.name,
                    email: response.email,
                    role: response.role,
                },
                accessToken: response.accessToken,
            })
        );
        if (response.role === "EMPLOYER") {
            router.push("/dashboard/employer");
        } else {
            router.push("/dashboard/seeker");
        }
    }

    async function logout() {
        try {
            await authService.logout();
        } finally {
            dispatch(clearCredentials());
            router.push("/login");
        }
    }

    return { user, isAuthenticated, accessToken, login, register, logout };
}