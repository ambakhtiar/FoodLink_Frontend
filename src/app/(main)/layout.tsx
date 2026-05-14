"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

// Routes where the footer should be visible
const FOOTER_VISIBLE_ROUTES = ["/", "/about", "/contact"];

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showFooter = FOOTER_VISIBLE_ROUTES.includes(pathname);

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            {showFooter && <Footer />}
        </>
    );
}
