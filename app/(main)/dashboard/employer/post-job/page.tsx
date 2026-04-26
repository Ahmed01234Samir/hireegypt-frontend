"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import Link from "next/link";
import toast from "react-hot-toast";

const schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    requirements: z.string().optional(),
    benefits: z.string().optional(),
    location: z.string().optional(),
    isRemote: z.boolean().optional(),
    jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]),
    experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD"]),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    salaryCurrency: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PostJobPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            jobType: "FULL_TIME",
            experienceLevel: "ENTRY",
            salaryCurrency: "EGP",
            isRemote: false,
        },
    });

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await api.post("/jobs", {
                ...data,
                salaryMin: data.salaryMin ? parseFloat(data.salaryMin) : null,
                salaryMax: data.salaryMax ? parseFloat(data.salaryMax) : null,
            });
            toast.success("Job posted successfully!");
            router.push("/dashboard/employer");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-brand-600">
                        HireEgypt
                    </Link>
                    <Link
                        href="/dashboard/employer"
                        className="text-sm text-gray-600 hover:text-brand-600 transition"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Post a New Job</h1>
                <p className="text-gray-500 mb-8">Fill in the details to attract the best candidates</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title *
                            </label>
                            <input
                                {...register("title")}
                                placeholder="e.g. Senior React Developer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                                <select
                                    {...register("jobType")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                                >
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERNSHIP">Internship</option>
                                    <option value="FREELANCE">Freelance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
                                <select
                                    {...register("experienceLevel")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                                >
                                    <option value="ENTRY">Entry Level</option>
                                    <option value="MID">Mid Level</option>
                                    <option value="SENIOR">Senior</option>
                                    <option value="LEAD">Lead</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                {...register("location")}
                                placeholder="e.g. Cairo, Egypt"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("isRemote")}
                                    className="w-4 h-4 accent-brand-600"
                                />
                                <span className="text-sm text-gray-700">This is a remote position</span>
                            </label>
                        </div>
                    </div>

                    {/* Salary */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Salary Range</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                                <input
                                    {...register("salaryMin")}
                                    type="number"
                                    placeholder="8000"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                                <input
                                    {...register("salaryMax")}
                                    type="number"
                                    placeholder="15000"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    {...register("salaryCurrency")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                                >
                                    <option value="EGP">EGP</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Description *
                            </label>
                            <textarea
                                {...register("description")}
                                rows={5}
                                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                            <textarea
                                {...register("requirements")}
                                rows={4}
                                placeholder="List the skills, experience, and qualifications required..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                            <textarea
                                {...register("benefits")}
                                rows={3}
                                placeholder="What do you offer? Health insurance, flexible hours, remote work..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
                        >
                            {loading ? "Posting..." : "Post Job"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/employer")}
                            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}