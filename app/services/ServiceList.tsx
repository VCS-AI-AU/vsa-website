"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ServiceItem = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  priceFrom: number;
  featured: boolean;
  category?: { slug: string; name: string };
};

export default function ServiceList() {
  const params = useSearchParams();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => params.toString(), [params]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const url = "/api/services" + (queryString ? `?${queryString}` : "");
    fetch(url, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        setItems(json.data ?? []);
      })
      .catch((err: any) => {
        if (err?.name !== "AbortError") setError(String(err?.message || err));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [queryString]);

  if (loading) return <p aria-live="polite">Loading services…</p>;
  if (error) return <p role="alert">Failed to load services: {error}</p>;
  if (!items.length) return <p>No services found. Try adjusting filters.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Services list">
      {items.map((s) => (
        <li key={s.id} className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium">{s.name}</h3>
            {s.featured ? (
              <span className="ml-2 rounded bg-yellow-500/10 px-2 py-0.5 text-xs">Featured</span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
          <div className="mt-3 text-sm">
            From <span className="font-semibold">${s.priceFrom}</span>
          </div>
          {s.category ? (
            <div className="mt-1 text-xs text-muted-foreground">{s.category.name}</div>
          ) : null}
          <div className="mt-4">
            <a className="inline-flex items-center rounded-md border px-3 py-2 text-sm" href={`/services/${s.slug}`}>
              Learn more
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
