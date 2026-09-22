import { z } from "zod";

export const driverSchema = z.object({
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
        .email("Enter a valid email address"),

    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username is too long"),
});

export type DriverFormData = z.infer<typeof driverSchema>;