"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${params.id}`);
                if (!res.ok) throw new Error("Post not found");
                const data = await res.json();
                setPost(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!post) return;

        setSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const published = formData.get("published") === "on";

        try {
            const res = await fetch(`/api/posts/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, published }),
            });

            if (!res.ok) {
                throw new Error("Failed to update post");
            }

            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!post) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Post not found</p>
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
                    ← Dashboard
                </Link>
                <h1 className="text-4xl font-bold text-gray-900">Edit Post</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-black-900">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        defaultValue={post.title}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-black-900">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        rows={12}
                        defaultValue={post.content}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 text-black"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        defaultChecked={post.published}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-900">
                        Published
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded"
                >
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
