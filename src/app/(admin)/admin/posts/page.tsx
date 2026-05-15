import { Metadata } from "next";
import { FULL_APP_NAME } from "@/lib/constants";
import { PostsTable } from "@/components/admin/posts/PostsTable";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
    title: `Manage Posts | ${FULL_APP_NAME} Admin`,
    description: "Monitor and manage all user posts, suspend violations, or delete content.",
};

export default function AdminPostsPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <FileText className="h-4 w-4" />
                    <span>Post Management</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">Manage Posts</h1>
                <p className="text-muted-foreground font-medium">
                    Monitor user-generated content and handle community guidelines violations.
                </p>
            </div>

            <div className="glass-panel rounded-2xl border border-border/60 overflow-hidden">
                <PostsTable />
            </div>
        </div>
    );
}
