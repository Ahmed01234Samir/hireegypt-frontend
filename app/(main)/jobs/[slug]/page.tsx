"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs.service";
import { applicationsService } from "@/services/applications.service";
import { formatSalary, timeAgo } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function JobDetailPage({
                                          params,
                                      }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [applying, setApplying] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["job", slug],
        queryFn: () => jobsService.getJob(slug),
    });

    const { data: hasApplied, refetch: refetchApplied } = useQuery({
        queryKey: ["has-applied", data?.id],
        queryFn: () => applicationsService.checkApplied(data!.id),
        enabled: !!data?.id && isAuthenticated,
    });

    async function handleApply() {
        if (!isAuthenticated) {
            toast.error("Please sign in to apply");
            router.push("/login");
            return;
        }
        setShowApplyModal(true);
    }

    async function submitApplication() {
        try {
            setApplying(true);
            await applicationsService.apply(data!.id, { coverLetter });
            toast.success("Application submitted successfully! 🎉");
            setShowApplyModal(false);
            refetchApplied();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to apply");
        } finally {
            setApplying(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-brand-600">
                        HireEgypt
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/jobs" className="text-gray-600 text-sm hover:text-brand-600 transition">
                            Browse Jobs
                        </Link>
                        {isAuthenticated ? (
                            <button
                                onClick={() => router.push("/dashboard/seeker")}
                                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                            >
                                Dashboard
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link href="/jobs" className="text-brand-600 text-sm hover:underline mb-6 inline-block">
                    ← Back to Jobs
                </Link>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.title}</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-brand-600 font-medium">{data.company.name}</span>
                                        {data.company.isVerified && (
                                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                                        )}
                                    </div>
                                </div>
                                {hasApplied ? (
                                    <span className="bg-green-100 text-green-700 px-5 py-3 rounded-lg font-semibold text-sm">
                    ✓ Applied
                  </span>
                                ) : (
                                    <button
                                        onClick={handleApply}
                                        className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition shrink-0"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full">
                  📍 {data.location}
                </span>
                                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full">
                  💼 {data.jobType.replace("_", " ")}
                </span>
                                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full">
                  📊 {data.experienceLevel}
                </span>
                                <span className="bg-brand-50 text-brand-600 text-sm px-3 py-1.5 rounded-full font-medium">
                  💰 {formatSalary(data.salaryMin, data.salaryMax, data.salaryCurrency)}
                </span>
                                {data.isRemote && (
                                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1.5 rounded-full">
                    🌍 Remote
                  </span>
                                )}
                                <span className="bg-gray-100 text-gray-400 text-sm px-3 py-1.5 rounded-full">
                  🕐 Posted {timeAgo(data.postedAt)}
                </span>
                            </div>

                            {/* Skills */}
                            {data.skills && data.skills.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="bg-brand-50 text-brand-700 text-sm px-3 py-1 rounded-full border border-brand-200"
                                            >
                        {skill.name}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Job Description</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{data.description}</p>
                            </div>

                            {data.requirements && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">Requirements</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{data.requirements}</p>
                                </div>
                            )}

                            {data.benefits && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">Benefits</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{data.benefits}</p>
                                </div>
                            )}

                            {/* Apply Bottom */}
                            <div className="pt-4 border-t border-gray-100">
                                {hasApplied ? (
                                    <div className="w-full bg-green-50 text-green-700 py-3 rounded-lg font-semibold text-center">
                                        ✓ You have already applied for this position
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleApply}
                                        className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
                                    >
                                        Apply for this Position
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full md:w-72 shrink-0">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-semibold text-gray-800 mb-4">About the Company</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 font-bold text-lg">
                                    {data.company.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{data.company.name}</p>
                                    <p className="text-sm text-gray-500">{data.company.industry}</p>
                                </div>
                            </div>
                            {data.company.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <span>📍</span><span>{data.company.location}</span>
                                </div>
                            )}
                            {data.company.isVerified && (
                                <div className="mt-4 bg-blue-50 text-blue-600 text-sm px-3 py-2 rounded-lg text-center">
                                    ✓ Verified Company
                                </div>
                            )}
                            {!hasApplied && (
                                <button
                                    onClick={handleApply}
                                    className="w-full mt-4 bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition text-sm"
                                >
                                    Apply Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Apply for {data.title}</h2>
                        <p className="text-gray-500 text-sm mb-6">{data.company.name}</p>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Letter <span className="text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows={5}
                                placeholder="Tell the employer why you're a great fit for this role..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                            />
                        </div>

                        <div className="bg-brand-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-brand-700">
                                📄 Your profile CV will be attached automatically. Make sure your profile is up to date.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={submitApplication}
                                disabled={applying}
                                className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
                            >
                                {applying ? "Submitting..." : "Submit Application"}
                            </button>
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}