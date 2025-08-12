const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  try {
    const cats = [
      { slug: "strategy", name: "Strategy" },
      { slug: "design", name: "Design" },
      { slug: "engineering", name: "Engineering" },
      { slug: "marketing", name: "Marketing" },
    ];
    for (const c of cats) {
      await prisma.serviceCategory.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
    }
    const map = Object.fromEntries((await prisma.serviceCategory.findMany()).map(c => [c.slug, c.id]));
    const S = (slug,name,summary,priceFrom,featured,cat) => ({
      slug, name, summary, description: summary, priceFrom: String(priceFrom), featured, categoryId: map[cat],
    });
    const svcs = [
      S("website-audit","Website Audit","Audit incl. a11y/SEO/CWV, with fixes.",1800,true,"strategy"),
      S("landing-page","Landing Page","Design+build a fast, accessible landing page.",3200,true,"design"),
      S("ecommerce-integration","Ecommerce Integration","Headless checkout + catalog.",7800,false,"engineering"),
      S("seo-sprint","SEO Sprint","4-week technical SEO sprint.",4500,false,"marketing"),
      S("brand-refresh","Brand Refresh","Update tokens/typography/colors.",5200,false,"design"),
      S("performance-optimization","Performance Optimization","Improve Core Web Vitals.",3900,true,"engineering"),
    ];
    for (const s of svcs) {
      await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
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
