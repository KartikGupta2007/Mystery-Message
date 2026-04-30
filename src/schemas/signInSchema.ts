import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string(), // This can be either username or email, so we keep it as a simple string without specific validation.
    password: z.string().min(6, {message : "Password must be at least of 6 characters long"})
});
