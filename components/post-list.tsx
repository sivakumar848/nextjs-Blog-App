"use client";

import Link from "next/link";

interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
    author: {
        name: string | null;
        email: string;
    };
}

interface PostListProps {
    posts: Post[];
}

export function PostList({ posts }: PostListProps) {
    return (
        <div className="space-y-6">
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found</p>
            ) : (
                posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                    >
                        <Link href={`/blog/${post.id}`}>
                            <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {post.title}
                            </h2>
                        </Link>
                        <p className="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                            <span>By {post.author.name || post.author.email}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </article>
                ))
            )}
        </div>
    );
}
