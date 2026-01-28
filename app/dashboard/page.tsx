"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
    id: string;
    title: string;
    published: boolean;
    createdAt: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts");
                if (res.ok) {
                    const data = await res.json();
                    // Filter posts by current user
                    const userPosts = data.filter(
                        (post: Post & { author: { email: string } }) =>
                            post.author.email === session?.user?.email
                    );
                    setPosts(userPosts);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchPosts();
        }
    }, [session?.user]);

    if (status === "loading" || loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-blue-900">Dashboard</h1>
                <Link
                    href="/dashboard/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                    New Post
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Posts</h2>

                {posts.length === 0 ? (
                    <p className="text-gray-500">
                        No posts yet.{" "}
                        <Link href="/dashboard/create" className="text-blue-600 hover:text-blue-500">
                            Create your first post
                        </Link>
                    </p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                        {post.published ? " • Published" : " • Draft"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/edit/${post.id}`}
                                        className="text-blue-600 hover:text-blue-500 text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm("Are you sure?")) {
                                                fetch(`/api/posts/${post.id}`, { method: "DELETE" }).then(() => {
                                                    setPosts(posts.filter((p) => p.id !== post.id));
                                                });
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-500 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
