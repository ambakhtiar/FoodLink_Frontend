"use client";

import { useAdminPosts } from "@/hooks/useAdminQueries";
import { useUpdatePostStatus, useDeletePostMutation } from "@/hooks/useAdminMutations";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DataTableSearch,
    DataTableFilter,
    DataTablePagination,
} from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Eye, 
    MoreHorizontal, 
    ShieldAlert, 
    Trash2, 
    User,
    CheckCircle2,
    Ban,
    FileText
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export function PostsTable() {
    const searchParams = useSearchParams();
    
    // Use URL params for state to ensure consistency with generic table utilities
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const searchTerm = searchParams.get("search") ?? "";
    const statusFilter = searchParams.get("status") ?? "";

    const { data, isLoading } = useAdminPosts({
        page,
        limit: 10,
        searchTerm,
        status: statusFilter === "" ? undefined : statusFilter,
    });

    const { mutate: updateStatus, isPending: isUpdating } = useUpdatePostStatus();
    const { mutate: deletePost, isPending: isDeleting } = useDeletePostMutation();

    const posts = data?.data || [];
    const meta = data?.meta;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "bg-green-500/10 text-green-600 border-green-200/50";
            case "PENDING_HANDOVER":
                return "bg-blue-500/10 text-blue-600 border-blue-200/50";
            case "COMPLETED":
                return "bg-indigo-500/10 text-indigo-600 border-indigo-200/50";
            case "EXPIRED":
                return "bg-orange-500/10 text-orange-600 border-orange-200/50";
            case "SUSPENDED":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-gray-500/10 text-gray-600 border-gray-200/50";
        }
    };

    return (
        <div className="space-y-4">
            <div className="p-4 border-b border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30">
                <div className="w-full md:w-80">
                    <DataTableSearch
                        placeholder="Search title or description..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableFilter
                        placeholder="All Status"
                        paramKey="status"
                        options={[
                            { label: "Available", value: "AVAILABLE" },
                            { label: "Handover", value: "PENDING_HANDOVER" },
                            { label: "Completed", value: "COMPLETED" },
                            { label: "Expired", value: "EXPIRED" },
                            { label: "Suspended", value: "SUSPENDED" },
                        ]}
                    />
                </div>
            </div>

            <div className="relative">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead className="min-w-[200px]">Post Details</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={7} className="h-16 animate-pulse bg-muted/20" />
                                </TableRow>
                            ))
                        ) : posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                                    No posts found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center">
                                            {post.imageUrls && post.imageUrls.length > 0 ? (
                                                <Image
                                                    src={post.imageUrls[0]}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground line-clamp-1">{post.title}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1 italic text-primary uppercase tracking-tighter">
                                                {post.type}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="font-medium text-sm">
                                                {post.author.organizationProfile?.orgName || 
                                                 post.author.userProfile?.name || 
                                                 "Unknown"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-semibold text-[10px] tracking-wider uppercase">
                                            {post.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${getStatusColor(post.status)} font-bold text-[10px]`}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-medium">
                                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-1">
                                                <DropdownMenuLabel className="text-xs">Post Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                                    <Eye className="h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                
                                                {post.status === "SUSPENDED" ? (
                                                    <DropdownMenuItem 
                                                        className="gap-2 cursor-pointer text-green-600 focus:text-green-600"
                                                        onClick={() => updateStatus({ postId: post.id, status: "AVAILABLE" })}
                                                        disabled={isUpdating}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" /> Restore Post
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem 
                                                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                                        onClick={() => updateStatus({ postId: post.id, status: "SUSPENDED" })}
                                                        disabled={isUpdating}
                                                    >
                                                        <Ban className="h-4 w-4" /> Suspend Post
                                                    </DropdownMenuItem>
                                                )}

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem 
                                                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Permanent Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="flex items-center gap-2">
                                                                <ShieldAlert className="h-5 w-5 text-destructive" />
                                                                Are you absolutely sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action will permanently delete <strong>{post.title}</strong> and all associated data from the database. This cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                onClick={() => deletePost(post.id)}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? "Deleting..." : "Delete Permanently"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="p-4 border-t border-border/50 bg-muted/10">
                    <DataTablePagination
                        totalPages={meta.totalPages}
                    />
                </div>
            )}
        </div>
    );
}
