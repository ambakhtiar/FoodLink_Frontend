"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { reviewService } from "@/services/reviewService";

const reviewSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5),
    comment: z.string().max(500, "Comment must be under 500 characters").optional(),
});

interface ReviewDialogProps {
    transactionId: string;
    revieweeId: string;
    revieweeName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ReviewDialog({
    transactionId,
    revieweeId,
    revieweeName,
    open,
    onOpenChange,
    onSuccess,
}: ReviewDialogProps) {
    const [hoveredStar, setHoveredStar] = useState(0);

    const form = useForm({
        defaultValues: {
            rating: 0,
            comment: "",
        },
        onSubmit: async ({ value }) => {
            const parsed = reviewSchema.safeParse(value);
            if (!parsed.success) {
                toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
                return;
            }
            try {
                await reviewService.createReview({
                    transactionId,
                    revieweeId,
                    rating: parsed.data.rating,
                    comment: parsed.data.comment || undefined,
                });
                toast.success("Review submitted successfully!");
                form.reset();
                onOpenChange(false);
                onSuccess();
            } catch (err: unknown) {
                const message =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                    "Failed to submit review";
                toast.error(message);
            }
        },
    });

    const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) form.reset(); onOpenChange(o); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with <strong>{revieweeName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-5"
                >
                    {/* Star Rating */}
                    <form.Field
                        name="rating"
                        children={(field) => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rating</label>
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => field.handleChange(star)}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            className="transition-transform hover:scale-110 focus:outline-none"
                                            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${
                                                    star <= (hoveredStar || field.state.value)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-muted-foreground/30"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    {field.state.value > 0 && (
                                        <span className="text-sm text-muted-foreground ml-2 font-medium">
                                            {ratingLabels[field.state.value]}
                                        </span>
                                    )}
                                </div>
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Comment */}
                    <form.Field
                        name="comment"
                        children={(field) => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Comment{" "}
                                    <span className="text-muted-foreground font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    rows={3}
                                    placeholder="Share details about your experience..."
                                    className="w-full bg-muted/50 rounded-xl p-3 text-sm outline-none border border-transparent focus:border-primary/40 transition-all resize-none"
                                />
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                                )}
                            </div>
                        )}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => { form.reset(); onOpenChange(false); }}
                            disabled={form.state.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <form.Subscribe
                            selector={(state) => ({
                                isSubmitting: state.isSubmitting,
                                rating: state.values.rating,
                            })}
                            children={({ isSubmitting, rating }) => (
                                <Button type="submit" disabled={isSubmitting || rating === 0}>
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    Submit Review
                                </Button>
                            )}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
