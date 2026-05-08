import { z } from "zod";

// User roles matching backend
export const UserRole = {
  USER: "USER",
  ORGANIZATION: "ORGANIZATION",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// Login schema - supports email or phone number
export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email or phone number is required",
    })
    .min(1, "Email or phone number is required"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Base register schema
const baseRegisterSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
  phone: z.string({
    required_error: "Phone number is required",
  }),
  role: z.nativeEnum(UserRole, {
    required_error: "Role is required",
  }),
  latitude: z.number({
    required_error: "Latitude is required",
  }),
  longitude: z.number({
    required_error: "Longitude is required",
  }),
});

// User register schema (name required)
export const userRegisterSchema = baseRegisterSchema.extend({
  role: z.literal(UserRole.USER),
  name: z.string({
    required_error: "Name is required",
  }),
});

// Organization register schema (orgName required, optional fields)
export const orgRegisterSchema = baseRegisterSchema.extend({
  role: z.literal(UserRole.ORGANIZATION),
  orgName: z.string({
    required_error: "Organization name is required",
  }),
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
  googleToken: z.string({
    required_error: "Google token is required",
  }),
});

export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
