import type {Metadata} from "next";
import {Tilt_Neon} from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/app/layout/Header";

const inter = Tilt_Neon({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "BeyondBrand",
    description: "Branding generator webapp",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Header/>
        {children}
        </body>
        </html>
    );
}