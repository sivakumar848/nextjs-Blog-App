"use client";

import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/header";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Header />
            {children}
        </SessionProvider>
    );
}
