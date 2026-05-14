"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

// Routes where the footer should be hidden
const NO_FOOTER_ROUTES = ["/feed", "/post/create"];

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideFooter = NO_FOOTER_ROUTES.some((route) => pathname.startsWith(route));

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            {!hideFooter && <Footer />}
        </>
    );
}
