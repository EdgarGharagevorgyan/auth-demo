import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const refreshSchema = z.object({
    token: z.string().min(1, { message: "Refresh token is required" }),
});

export const forgotSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
});

export const resetSchema = z.object({
    token: z.string().min(1, { message: "Reset token is required" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
