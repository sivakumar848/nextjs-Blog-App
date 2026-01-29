import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: { select: { name: true, email: true } } },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        if (post.authorId !== (session.user.id as string)) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, content, published } = body;

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                published,
            },
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update post" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        if (post.authorId !== (session.user.id as string)) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Post deleted" });
    } catch (error) {
        console.error("Delete post error:", error);
        return NextResponse.json(
            { message: "Failed to delete post", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
