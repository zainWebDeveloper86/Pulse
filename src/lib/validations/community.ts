import { z } from "zod";

export const communityValidation = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters required")
    .max(50, "Maximum 50 characters allowed"),
  username: z
    .string()
    .min(3, "Minimum 3 characters required")
    .max(30, "Maximum 30 characters allowed")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  bio: z
    .string()
    .max(500, "Maximum 500 characters allowed")
    .optional()
    .or(z.literal("")),
  image: z.string().optional(),
});

export type CommunityFormData = z.infer<typeof communityValidation>;