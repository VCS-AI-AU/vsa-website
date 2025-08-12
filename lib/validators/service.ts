import { z } from "zod";

export const serviceFiltersSchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  featured: z
    .union([z.literal("1"), z.literal("true"), z.literal("0"), z.literal("false")])
    .optional()
    .transform((v) => (v === "1" || v === "true" ? true : v ? false : undefined)),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest").optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(50).default(12).optional(),
});

export type ServiceFilters = z.infer<typeof serviceFiltersSchema>;

export const serializeService = (s: any) => ({
  id: s.id,
  slug: s.slug,
  name: s.name,
  summary: s.summary,
  description: s.description,
  priceFrom: Number(s.priceFrom),
  featured: s.featured,
  category: s.category ? { slug: s.category.slug, name: s.category.name } : undefined,
  createdAt: s.createdAt?.toISOString?.() ?? s.createdAt,
  updatedAt: s.updatedAt?.toISOString?.() ?? s.updatedAt,
});
