import { z } from "zod";

export const inquirySchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z
      .string()
      .trim()
      .max(30)
      .optional()
      .refine((v) => !v || /^[+()\d\-.\s]{7,}$/.test(v), "Enter a valid phone number"),
    message: z.string().min(10).max(2000),
    serviceSlug: z.string().min(1).max(100).optional(),
    consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
    formLoadedAt: z.number().int(),
    hp: z.string().max(0).optional().or(z.literal("")).optional(),
  })
  .refine(
    (data) => Date.now() - data.formLoadedAt >= 3000,
    "Form submitted too quickly; please try again."
  );

export type InquiryInput = z.infer<typeof inquirySchema>;
