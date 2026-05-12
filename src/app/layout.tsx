import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/lib/QueryProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ProfileGuard } from "@/components/shared/ProfileGuard";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FoodLink - Connecting Food Donors with Receivers",
    description: "A platform to reduce food waste by connecting food donors with organizations in need.",
};



import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
            data-scroll-behavior="smooth"
        >
            <body className="min-h-full flex flex-col">
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <QueryProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <ProfileGuard>
                                {children}
                            </ProfileGuard>
                            <Toaster />
                        </ThemeProvider>
                    </QueryProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
