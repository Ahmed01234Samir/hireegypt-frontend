"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import toast from "react-hot-toast";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await login(data);
            toast.success("Welcome back!");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-600">HireEgypt</h1>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-brand-600 font-medium hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}