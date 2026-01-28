import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {type NextAuthOptions} from "next-auth";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, published } = body;

        // Fetch the user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published || false,
                authorId: user.id,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("POST /api/posts error:", error);
        return NextResponse.json(
            { message: "Failed to create post" },
            { status: 500 }
        );
    }
}
