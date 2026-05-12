import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/lib/QueryProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ProfileGuard } from "@/components/shared/ProfileGuard";
import { FULL_APP_NAME } from "@/lib/constants";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: FULL_APP_NAME,
        template: `%s | ${FULL_APP_NAME}`,
    },
    description: `${FULL_APP_NAME} - Connecting Surplus to Sustenance. A platform for reducing food waste and helping those in need.`,
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
                            <Toaster richColors position="top-right" />
                        </ThemeProvider>
                    </QueryProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
