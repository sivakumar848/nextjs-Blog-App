import { PostList } from "@/components/post-list";
import { prisma } from "@/lib/prisma";

async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });
        return posts;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getPosts();

    // Convert Date fields to string
    const serializedPosts = posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    }));

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-8">Blog</h1>
            <PostList posts={serializedPosts} />
        </div>
    );
}
