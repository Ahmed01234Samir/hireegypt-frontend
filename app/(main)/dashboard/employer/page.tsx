"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Link from "next/link";
import { formatSalary, timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

export default function EmployerDashboard() {
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

    const { data: jobsData, isLoading } = useQuery({
        queryKey: ["employer-jobs"],
        queryFn: async () => {
            const res = await api.get("/jobs/employer");
            return res.data.data;
        },
        enabled: mounted && isAuthenticated,
    });

    const { data: companyData } = useQuery({
        queryKey: ["my-company"],
        queryFn: async () => {
            const res = await api.get("/companies/me");
            return res.data.data;
        },
        enabled: mounted && isAuthenticated,
    });

    async function handleDeleteJob(jobId: number) {
        toast.error("Delete feature coming soon!");
    }

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-brand-600">
                        HireEgypt
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">🏢 {user?.name}</span>
                        <Link
                            href="/jobs"
                            className="text-sm text-gray-600 hover:text-brand-600 transition"
                        >
                            View Jobs
                        </Link>
                        <button
                            onClick={logout}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Employer Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {companyData ? companyData.name : "Set up your company profile"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!companyData && (
                            <button
                                onClick={() => router.push("/dashboard/employer/company")}
                                className="border border-brand-600 text-brand-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-50 transition"
                            >
                                Setup Company
                            </button>
                        )}
                        <button
                            onClick={() => router.push("/dashboard/employer/post-job")}
                            className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                        >
                            + Post a Job
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Active Jobs</p>
                        <p className="text-3xl font-bold text-brand-600 mt-1">
                            {jobsData?.content?.filter((j: any) => j.status === "ACTIVE").length ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Total Jobs Posted</p>
                        <p className="text-3xl font-bold text-brand-600 mt-1">
                            {jobsData?.totalElements ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Total Views</p>
                        <p className="text-3xl font-bold text-brand-600 mt-1">
                            {jobsData?.content?.reduce((sum: number, j: any) => sum + j.viewsCount, 0) ?? 0}
                        </p>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Your Job Listings</h2>
                        <button
                            onClick={() => router.push("/dashboard/employer/post-job")}
                            className="text-sm text-brand-600 hover:underline"
                        >
                            + Add New
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-400">Loading jobs...</div>
                    ) : jobsData?.content?.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-400 text-lg mb-4">No jobs posted yet</p>
                            <button
                                onClick={() => router.push("/dashboard/employer/post-job")}
                                className="bg-brand-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                            >
                                Post Your First Job
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Job Title</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Salary</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Views</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Posted</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {jobsData?.content?.map((job: any) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/jobs/${job.slug}`}
                                                className="font-medium text-gray-900 hover:text-brand-600 transition"
                                            >
                                                {job.title}
                                            </Link>
                                            <p className="text-sm text-gray-500">{job.location}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {job.jobType.replace("_", " ")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            👁 {job.viewsCount}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {timeAgo(job.postedAt)}
                                        </td>
                                        <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            job.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}>
                          {job.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}