"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import Link from "next/link";
import toast from "react-hot-toast";

const schema = z.object({
    name: z.string().min(2, "Company name is required"),
    industry: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    size: z.string().optional(),
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CompanySetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await api.post("/companies/me", data);
            toast.success("Company profile saved!");
            router.push("/dashboard/employer");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to save company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-brand-600">HireEgypt</Link>
                    <Link href="/dashboard/employer" className="text-sm text-gray-600 hover:text-brand-600">
                        ← Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Company Profile</h1>
                <p className="text-gray-500 mb-8">This information will appear on all your job listings</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                            <input
                                {...register("name")}
                                placeholder="e.g. Valeo Egypt"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                <input
                                    {...register("industry")}
                                    placeholder="e.g. Technology"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                                <select
                                    {...register("size")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="201-500">201-500</option>
                                    <option value="500+">500+</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                {...register("location")}
                                placeholder="e.g. Cairo, Egypt"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                {...register("website")}
                                placeholder="e.g. https://valeo.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                {...register("description")}
                                rows={4}
                                placeholder="Tell candidates about your company..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Company Profile"}
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