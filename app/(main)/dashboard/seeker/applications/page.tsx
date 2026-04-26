"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { applicationsService } from "@/services/applications.service";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    REVIEWED: "bg-blue-100 text-blue-700",
    SHORTLISTED: "bg-purple-100 text-purple-700",
    REJECTED: "bg-red-100 text-red-700",
    HIRED: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
    PENDING: "⏳ Pending",
    REVIEWED: "👀 Reviewed",
    SHORTLISTED: "⭐ Shortlisted",
    REJECTED: "❌ Rejected",
    HIRED: "🎉 Hired",
};

export default function MyApplicationsPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/login");
        }
    }, [mounted, isAuthenticated]);

    const { data, isLoading } = useQuery({
        queryKey: ["my-applications"],
        queryFn: () => applicationsService.getMyApplications(),
        enabled: mounted && isAuthenticated,
    });

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-brand-600">HireEgypt</Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/seeker" className="text-sm text-gray-600 hover:text-brand-600">
                            ← Dashboard
                        </Link>
                        <span className="text-gray-600 text-sm">👋 {user?.name}</span>
                        <button
                            onClick={logout}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Applications</h1>
                <p className="text-gray-500 mb-8">Track the status of your job applications</p>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                ) : data?.content?.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                        <p className="text-gray-400 text-lg mb-4">No applications yet</p>
                        <Link
                            href="/jobs"
                            className="bg-brand-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data?.content?.map((app) => (
                            <div
                                key={app.id}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-brand-200 transition"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 font-bold">
                                                {app.companyName.charAt(0)}
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/jobs/${app.jobSlug}`}
                                                    className="font-semibold text-gray-900 hover:text-brand-600 transition"
                                                >
                                                    {app.jobTitle}
                                                </Link>
                                                <p className="text-sm text-brand-600">{app.companyName}</p>
                                            </div>
                                        </div>

                                        {app.coverLetter && (
                                            <p className="text-sm text-gray-500 mt-3 line-clamp-2 ml-13">
                                                "{app.coverLetter}"
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 mt-2">
                                            Applied {timeAgo(app.appliedAt)}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColors[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>
                                        {app.matchScore && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                Match: {app.matchScore}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}