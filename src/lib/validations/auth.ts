import { z } from "zod";

// User roles matching backend
export const UserRole = {
    USER: "USER",
    ORGANIZATION: "ORGANIZATION",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// Login schema - supports email or phone number
export const loginSchema = z.object({
    email: z.string().min(1, "Email or phone number is required"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Base register schema
const baseRegisterSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladeshi number (e.g., +8801XXXXXXXXX)"),
    role: z.nativeEnum(UserRole),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

// User register schema (name required)
export const userRegisterSchema = baseRegisterSchema.extend({
    role: z.literal(UserRole.USER),
    name: z.string().min(1, "Name is required"),
});

// Organization register schema (orgName required, optional fields)
export const orgRegisterSchema = baseRegisterSchema.extend({
    role: z.literal(UserRole.ORGANIZATION),
    orgName: z.string().min(1, "Organization name is required"),
    establishedYear: z.number().optional(),
    registrationNumber: z.string().optional(),
});

// Combined register schema with conditional validation
export const registerSchema = z.discriminatedUnion("role", [
    userRegisterSchema,
    orgRegisterSchema,
]);

export type RegisterInput = z.infer<typeof registerSchema>;
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type OrgRegisterInput = z.infer<typeof orgRegisterSchema>;

// Google login schema
export const googleLoginSchema = z.object({
    googleToken: z.string().min(1, "Google token is required"),
});

export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
