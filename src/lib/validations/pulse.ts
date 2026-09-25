import { z } from "zod";

export const pulseValidation = z.object({
  pulse: z
    .string()
    .min(3, "Minimum 3 Characters")
    .max(500, "Maximum 500 Characters"),
  accountId: z.string(),
});

export const commentValidation = z.object({
  pulse: z
    .string()
    .min(3, "Minimum 3 Characters")
    .max(300, "Maximum 300 Characters"),
});

export type PulseFormData = z.infer<typeof pulseValidation>;
export type CommentFormData = z.infer<typeof commentValidation>;
