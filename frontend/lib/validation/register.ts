import { z } from "zod";

export const registerSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name is too long"),

    last_name: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(100, "Last name is too long"),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),

    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username is too long"),

    password: z
        .string()
        .min(1, "Password is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;