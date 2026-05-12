"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Upload, 
    X, 
    Plus, 
    Image as ImageIcon, 
    Loader2, 
    AlertCircle,
    MapPin,
    Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { postService } from "@/services/postService";
import { PostType, PostCategory } from "@/types/post";
import { useRouter } from "next/navigation";

const createPostSchema = z.object({
    type: z.nativeEnum(PostType),
    category: z.nativeEnum(PostCategory),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    latitude: z.number(),
    longitude: z.number(),
    title: z.string().optional(),
    description: z.string().optional(),
});

type CreatePostValues = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreatePostValues>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            type: PostType.DONATION,
            category: PostCategory.COOKED_FOOD,
            quantity: 1,
            latitude: 23.8103, // Default to Dhaka
            longitude: 90.4125,
        },
    });

    const postType = watch("type");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (selectedImages.length + files.length > 3) {
            toast.error("You can only upload up to 3 images");
            return;
        }

        const newImages = [...selectedImages, ...files];
        setSelectedImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        
        // Revoke the URL to avoid memory leaks
        URL.revokeObjectURL(previews[index]);
        
        setSelectedImages(newImages);
        setPreviews(newPreviews);
    };

    const onSubmit = async (data: CreatePostValues) => {
        if (data.type === PostType.DONATION && selectedImages.length === 0) {
            toast.error("Please upload at least one image for donations");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            
            // Append basic fields
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, value.toString());
            });

            // Append images
            selectedImages.forEach((file) => {
                formData.append("images", file);
            });

            const result = await postService.createPost(formData);
            toast.success("Post created successfully!");
            router.push(`/food/${result.data.id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-card/50 backdrop-blur-xl">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-black">Create New Post</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground font-medium">
                    Share surplus food or request assistance from the community.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Post Type Selection */}
                    <div className="space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Post Type</Label>
                        <RadioGroup 
                            defaultValue={PostType.DONATION} 
                            onValueChange={(val) => setValue("type", val as PostType)}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value={PostType.DONATION} id="donation" className="peer sr-only" />
                                <Label
                                    htmlFor="donation"
                                    className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                                >
                                    <ImageIcon className="mb-3 h-6 w-6 text-primary" />
                                    <span className="font-bold">Donation</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value={PostType.REQUEST} id="request" className="peer sr-only" />
                                <Label
                                    htmlFor="request"
                                    className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                                >
                                    <AlertCircle className="mb-3 h-6 w-6 text-orange-500" />
                                    <span className="font-bold">Request</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Image Upload Area */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Images {postType === PostType.DONATION && <span className="text-red-500">*</span>}
                            </Label>
                            <span className="text-xs font-medium text-muted-foreground">{selectedImages.length}/3 images</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <AnimatePresence>
                                {previews.map((preview, index) => (
                                    <motion.div
                                        key={preview}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 group"
                                    >
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {index === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-black uppercase text-center py-1">
                                                AI Input
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {selectedImages.length < 3 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
                                >
                                    <div className="p-3 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                                        <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary uppercase tracking-tighter">Add Photo</span>
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5" /> Category
                            </Label>
                            <select
                                {...register("category")}
                                className="w-full h-12 rounded-2xl border-2 border-muted bg-popover px-4 font-bold focus:border-primary outline-none transition-all"
                            >
                                {Object.values(PostCategory).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.replace("_", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</Label>
                            <Input
                                type="number"
                                {...register("quantity", { valueAsNumber: true })}
                                className="h-12 rounded-2xl border-2 border-muted bg-popover px-4 font-bold focus:border-primary transition-all"
                            />
                            {errors.quantity && <p className="text-xs text-red-500 font-medium">{errors.quantity.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Location
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Lat"
                                type="number"
                                step="any"
                                {...register("latitude", { valueAsNumber: true })}
                                className="h-12 rounded-2xl border-2 border-muted bg-popover px-4 font-bold"
                            />
                            <Input
                                placeholder="Lng"
                                type="number"
                                step="any"
                                {...register("longitude", { valueAsNumber: true })}
                                className="h-12 rounded-2xl border-2 border-muted bg-popover px-4 font-bold"
                            />
                        </div>
                    </div>

                    {postType === PostType.REQUEST && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                                <Input
                                    {...register("title")}
                                    placeholder="e.g., Need dry food for 5 people"
                                    className="h-12 rounded-2xl border-2 border-muted bg-popover px-4 font-bold focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                <textarea
                                    {...register("description")}
                                    rows={4}
                                    placeholder="Explain your situation..."
                                    className="w-full rounded-2xl border-2 border-muted bg-popover p-4 font-bold focus:border-primary outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button 
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {postType === PostType.DONATION ? "Analyzing & Posting..." : "Creating Post..."}
                                </div>
                            ) : (
                                postType === PostType.DONATION ? "Submit Donation" : "Post Request"
                            )}
                        </Button>
                        <p className="mt-4 text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                            {postType === PostType.DONATION 
                                ? "Our AI will analyze your first photo to generate titles, descriptions, and estimated shelf life." 
                                : "HelpShare is a community platform. Be honest and respectful in your requests."}
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
