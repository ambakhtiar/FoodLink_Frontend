import { Feed } from "@/components/post/Feed";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community Feed | HelpShare",
    description: "Explore community donations and requests. Share surplus food and items with those in need.",
};

export default function FeedPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Feed />
        </main>
    );
}
