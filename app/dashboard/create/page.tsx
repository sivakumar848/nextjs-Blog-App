"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const published = formData.get("published") === "on";

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, published }),
            });

            if (!res.ok) {
                throw new Error("Failed to create post");
            }

            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="text-blue-600 hover:text-red-500">
                    ← Dashboard
                </Link>
                <h1 className="text-4xl font-bold text-blue-900">Create Post</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 text-black"
                        placeholder="Enter post title"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-900">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        rows={12}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 text-black"
                        placeholder="Enter post content"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-900">
                        Publish immediately
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded"
                >
                    {loading ? "Creating..." : "Create Post"}
                </button>
            </form>
        </div>
    );
}
