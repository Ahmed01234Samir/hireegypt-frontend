"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SeekerDashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-brand-600">HireEgypt</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">👋 Hello, {user?.name}</span>
                        <button
                            onClick={logout}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-gray-500 mb-8">Here's your job search overview</p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Applications Sent</p>
                        <p className="text-3xl font-bold text-brand-600 mt-1">0</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Saved Jobs</p>
                        <p className="text-3xl font-bold text-brand-600 mt-1">0</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Profile Views</p>
                        <p className="text-3xl font-bold text-brand-600 mt-1">0</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => router.push("/jobs")}
                            className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                        >
                            Browse Jobs
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/seeker/profile")}
                            className="border border-brand-600 text-brand-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-50 transition"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/seeker/applications")}
                            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                            My Applications
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}