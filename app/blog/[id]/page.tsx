import Link from "next/link";
import { notFound } from "next/navigation";

async function getPost(id: string) {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Post not found");
        return res.json();
    } catch (error) {
        notFound();
    }
}

export default async function PostPage({ params }: { params: { id: string } }) {
    const post = await getPost(params.id);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/blog" className="text-blue-600 hover:text-blue-500 mb-4 inline-block">
                ← Back to Blog
            </Link>

            <article className="bg-white rounded-lg shadow p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6 pb-6 border-b">
                    <span>By {post.author.name || post.author.email}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>
        </div>
    );
}
