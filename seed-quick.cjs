require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const categories = [
      { slug: "strategy", name: "Strategy" },
      { slug: "design", name: "Design" },
      { slug: "engineering", name: "Engineering" },
      { slug: "marketing", name: "Marketing" },
    ];
    for (const c of categories) {
      await prisma.serviceCategory.upsert({
        where: { slug: c.slug },
        update: { name: c.name },
        create: c,
      });
    }

    const cats = await prisma.serviceCategory.findMany();
    const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

    const services = [
      { slug: "website-audit", name: "Website Audit", summary: "Heuristic + performance audit with prioritized fixes.", description: "Audit covering accessibility (WCAG 2.2 AA), Core Web Vitals, SEO hygiene, and a prioritized remediation plan.", priceFrom: "1800", featured: true,  categoryId: bySlug.strategy },
      { slug: "landing-page",  name: "Landing Page",  summary: "High‑converting, fast, accessible landing page.",      description: "Design + build of a single marketing landing page in Next.js with a11y checks and SEO metadata.",     priceFrom: "3200", featured: true,  categoryId: bySlug.design },
      { slug: "ecommerce-integration", name: "Ecommerce Integration", summary: "Checkout integration and product catalog setup.", description: "Integrate a modern headless commerce provider, listing/search, and secure checkout.", priceFrom: "7800", featured: false, categoryId: bySlug.engineering },
      { slug: "seo-sprint", name: "SEO Sprint", summary: "Four‑week sprint to ship technical SEO fixes.", description: "Structured data (JSON‑LD), sitemaps, canonicals/robots, and performance optimizations.", priceFrom: "4500", featured: false, categoryId: bySlug.marketing },
      { slug: "brand-refresh", name: "Brand Refresh", summary: "Lightweight brand refinements and token updates.", description: "Refresh typography, color tokens, and UI polish; ship a tokenized theme.", priceFrom: "5200", featured: false, categoryId: bySlug.design },
      { slug: "performance-optimization", name: "Performance Optimization", summary: "Improve Core Web Vitals across key routes.", description: "Font loading, image strategy, route‑level code splitting, and INP improvements.", priceFrom: "3900", featured: true, categoryId: bySlug.engineering },
    ];

    for (const s of services) {
      await prisma.service.upsert({
        where: { slug: s.slug },
        update: { name: s.name, summary: s.summary, description: s.description, priceFrom: s.priceFrom, featured: s.featured, categoryId: s.categoryId },
        create: s,
      });
    }

    console.log("✅ seed done:", {
      categories: await prisma.serviceCategory.count(),
      services: await prisma.service.count(),
    });
  } catch (e) {
    console.error("Seed error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
