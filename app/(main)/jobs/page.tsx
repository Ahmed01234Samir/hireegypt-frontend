"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs.service";
import { JobFilters } from "@/types/job";
import Link from "next/link";
import { formatSalary, timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function JobsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [filters, setFilters] = useState<JobFilters>({ page: 0, size: 10 });
    const [keyword, setKeyword] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["jobs", filters],
        queryFn: () => jobsService.getJobs(filters),
    });

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setFilters((f) => ({ ...f, keyword, page: 0 }));
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-brand-600">
                        HireEgypt
                    </Link>
                    <div className="flex items-center gap-3">
                        {mounted && isAuthenticated ? (
                            <button
                                onClick={() => router.push("/dashboard/seeker")}
                                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                            >
                                Dashboard
                            </button>
                        ) : mounted ? (
                            <>
                                <Link href="/login" className="text-gray-600 text-sm hover:text-brand-600 transition">
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : null}
                    </div>
                </div>
            </nav>

            {/* Hero Search */}
            <div className="bg-gradient-to-r from-brand-900 to-brand-600 py-12 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Find Your Next Job in Egypt
                    </h1>
                    <p className="text-brand-100 mb-6">
                        Browse hundreds of opportunities from top companies
                    </p>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Job title, company, or keyword..."
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-lg hover:bg-brand-50 transition"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Filters + Results */}
            <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">

                {/* Sidebar Filters */}
                <div className="w-64 shrink-0 hidden md:block">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-600 mb-2 block">Job Type</label>
                            <select
                                onChange={(e) => setFilters((f) => ({ ...f, jobType: e.target.value as any || undefined, page: 0 }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">All Types</option>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="FREELANCE">Freelance</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-600 mb-2 block">Experience Level</label>
                            <select
                                onChange={(e) => setFilters((f) => ({ ...f, experienceLevel: e.target.value as any || undefined, page: 0 }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">All Levels</option>
                                <option value="ENTRY">Entry Level</option>
                                <option value="MID">Mid Level</option>
                                <option value="SENIOR">Senior</option>
                                <option value="LEAD">Lead</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    onChange={(e) => setFilters((f) => ({ ...f, isRemote: e.target.checked || undefined, page: 0 }))}
                                    className="w-4 h-4 accent-brand-600"
                                />
                                <span className="text-sm text-gray-600">Remote Only</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Job Cards */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-sm">
                            {data?.totalElements ?? 0} jobs found
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data?.content.map((job) => (
                                <Link key={job.id} href={`/jobs/${job.slug}`}>
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-brand-300 hover:shadow-md transition cursor-pointer">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h2 className="text-lg font-semibold text-gray-900 hover:text-brand-600 transition">
                                                        {job.title}
                                                    </h2>
                                                    {job.company.isVerified && (
                                                        <span className="text-blue-500 text-xs">✓ Verified</span>
                                                    )}
                                                </div>
                                                <p className="text-brand-600 font-medium text-sm mb-3">
                                                    {job.company.name}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            📍 {job.location}
                          </span>
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            💼 {job.jobType.replace("_", " ")}
                          </span>
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            📊 {job.experienceLevel}
                          </span>
                                                    {job.isRemote && (
                                                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                              🌍 Remote
                            </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-sm line-clamp-2">
                                                    {job.description}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-brand-600 font-semibold text-sm">
                                                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-1">
                                                    {timeAgo(job.postedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {data && data.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: data.totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setFilters((f) => ({ ...f, page: i }))}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                                        filters.page === i
                                            ? "bg-brand-600 text-white"
                                            : "bg-white text-gray-600 border border-gray-300 hover:border-brand-400"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}