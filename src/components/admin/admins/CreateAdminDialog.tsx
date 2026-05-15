"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdmin } from "@/hooks/useAdminMutations";
import { CreatedAdminResponse } from "@/services/adminService";
import {
    UserPlus,
    Copy,
    Check,
    ShieldCheck,
    KeyRound,
    Mail,
    Phone,
    User,
    Building,
    AlertCircle,
} from "lucide-react";

const createAdminSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    department: z.string().optional(),
});

type FormValues = z.infer<typeof createAdminSchema>;

export function CreateAdminDialog() {
    const [open, setOpen] = useState(false);
    const [createdAdmin, setCreatedAdmin] = useState<CreatedAdminResponse | null>(null);
    const [copied, setCopied] = useState(false);

    const { mutate: createAdmin, isPending } = useCreateAdmin((data) => {
        setCreatedAdmin(data);
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            department: "",
        } as FormValues,
        validators: {
            onChange: createAdminSchema,
        },
        onSubmit: async ({ value }) => {
            createAdmin({
                name: value.name,
                email: value.email,
                phone: value.phone,
                department: value.department || undefined,
            });
        },
    });

    const handleCopy = () => {
        if (createdAdmin?.defaultPassword) {
            navigator.clipboard.writeText(createdAdmin.defaultPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setOpen(false);
        // Reset after animation completes
        setTimeout(() => {
            setCreatedAdmin(null);
            setCopied(false);
            form.reset();
        }, 300);
    };

    const handleOpenChange = (val: boolean) => {
        if (!val) {
            handleClose();
        } else {
            setOpen(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2 font-bold rounded-xl shadow-sm"
                    onClick={() => setOpen(true)}
                >
                    <UserPlus className="h-4 w-4" />
                    Create New Admin
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
                {!createdAdmin ? (
                    <>
                        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-black tracking-tight">
                                        Create New Admin
                                    </DialogTitle>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                        Admin will be prompted to change their password on first login.
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="p-6 space-y-4"
                        >
                            {/* Name Field */}
                            <form.Field
                                name="name"
                                validators={{
                                    onChange: ({ value }) =>
                                        value.length < 2 ? "Name must be at least 2 characters" : undefined,
                                }}
                            >
                                {(field) => (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="admin-name" className="text-sm font-bold flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            Full Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="admin-name"
                                            placeholder="e.g. Sarah Johnson"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="rounded-xl bg-muted/40 border-border focus-visible:ring-primary/30"
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                                                <AlertCircle className="h-3 w-3" />
                                                {field.state.meta.errors[0]?.toString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Email Field */}
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: ({ value }) =>
                                        !/^\S+@\S+\.\S+$/.test(value) ? "Please enter a valid email address" : undefined,
                                }}
                            >
                                {(field) => (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="admin-email" className="text-sm font-bold flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            Email Address <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="admin-email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="rounded-xl bg-muted/40 border-border focus-visible:ring-primary/30"
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                                                <AlertCircle className="h-3 w-3" />
                                                {field.state.meta.errors[0]?.toString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Phone Field */}
                            <form.Field
                                name="phone"
                                validators={{
                                    onChange: ({ value }) =>
                                        value.length < 10 ? "Phone must be at least 10 digits" : undefined,
                                }}
                            >
                                {(field) => (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="admin-phone" className="text-sm font-bold flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                            Phone Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="admin-phone"
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="rounded-xl bg-muted/40 border-border focus-visible:ring-primary/30"
                                        />
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                                                <AlertCircle className="h-3 w-3" />
                                                {field.state.meta.errors[0]?.toString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Department Field */}
                            <form.Field name="department">
                                {(field) => (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="admin-dept" className="text-sm font-bold flex items-center gap-1.5">
                                            <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                            Department
                                            <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                                        </Label>
                                        <Input
                                            id="admin-dept"
                                            placeholder="e.g. Content Moderation"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="rounded-xl bg-muted/40 border-border focus-visible:ring-primary/30"
                                        />
                                    </div>
                                )}
                            </form.Field>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl font-bold"
                                    onClick={handleClose}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="rounded-xl font-bold gap-2"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" />
                                            Create Admin
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    /* Success State — show credentials */
                    <div className="flex flex-col">
                        <div className="p-6 pb-4 border-b border-border/50 bg-green-500/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-green-500/10">
                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-black tracking-tight text-green-700 dark:text-green-400">
                                        Admin Created!
                                    </DialogTitle>
                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                        Share these credentials securely. The password is shown only once.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Admin Info */}
                            <div className="rounded-xl bg-muted/50 border border-border/50 p-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground font-medium">Name:</span>
                                    <span className="font-bold">{createdAdmin.adminProfile?.name ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground font-medium">Email:</span>
                                    <span className="font-bold">{createdAdmin.email}</span>
                                </div>
                            </div>

                            {/* Default Password Panel */}
                            <div className="rounded-xl bg-amber-500/5 border border-amber-300/30 p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <KeyRound className="h-4 w-4 text-amber-600" />
                                    <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                                        Default Password
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 rounded-lg bg-muted font-mono text-base font-bold tracking-wider text-foreground">
                                        {createdAdmin.defaultPassword}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 rounded-lg shrink-0"
                                        onClick={handleCopy}
                                    >
                                        {copied
                                            ? <Check className="h-4 w-4 text-green-600" />
                                            : <Copy className="h-4 w-4" />
                                        }
                                    </Button>
                                </div>
                                <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70 font-medium">
                                    ⚠ The admin will be forced to change this password on first login.
                                </p>
                            </div>

                            <Button
                                className="w-full rounded-xl font-bold"
                                onClick={handleClose}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
