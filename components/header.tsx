"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <header className="bg-white shadow">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                    BlogApp
                </Link>

                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <span className="text-sm text-gray-700">{session.user?.email}</span>
                            <Link
                                href="/blog"
                                className="text-blue-600 hover:text-blue-500 text-sm"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-blue-600 hover:text-blue-500 text-sm"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
