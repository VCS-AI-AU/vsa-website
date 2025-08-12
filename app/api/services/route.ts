import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serviceFiltersSchema, serializeService } from "@/lib/validators/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = serviceFiltersSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }
  const { q, category, featured, sort = "newest", page = 1, pageSize = 12 } = parsed.data;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (typeof featured === "boolean") where.featured = featured;
  if (category) where.category = { slug: category };

  const orderBy =
    sort === "price_asc" ? { priceFrom: "asc" as const }
    : sort === "price_desc" ? { priceFrom: "desc" as const }
    : { createdAt: "desc" as const };

  const [total, items] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { slug: true, name: true } } },
    }),
  ]);

  const data = items.map(serializeService);
  return NextResponse.json({ data, pagination: { total, page, pageSize, hasMore: page * pageSize < total } });
}
