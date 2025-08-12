import type { Metadata } from 'next';
import ServiceFilters from './ServiceFilters';
import ServiceList from './ServiceList';

export const metadata: Metadata = {
  title: 'Services | VSA',
  description:
    'Explore VSA services across strategy, design, engineering, and marketing. Filter offerings and request a tailored proposal.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | VSA',
    description:
      'Explore VSA services across strategy, design, engineering, and marketing.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VSA Services',
    description:
      'Explore VSA services across strategy, design, engineering, and marketing.',
  },
};

export default async function ServicesPage() {
  // import prisma inside the component to avoid module‑init crashes
  const { default: prisma } = await import('@/lib/prisma');

  let categories: { slug: string; name: string }[] = [];
  try {
    categories = await prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
      select: { slug: true, name: true },
    });
  } catch (err) {
    console.error('Failed to load categories:', err);
    categories = [];
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'VSA Services',
    url: `${baseUrl}/services`,
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
      <p className="mt-2 text-muted-foreground">
        Explore our offerings and request a tailored proposal. All work ships
        with accessibility (WCAG 2.2 AA) and Core Web Vitals objectives.
      </p>

      <div className="mt-8">
        <ServiceFilters categories={categories} />
      </div>

      <div className="mt-6">
        <ServiceList />
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}

