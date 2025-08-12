"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Category = { slug: string; name: string };

export default function ServiceFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setCategory(params.get("category") ?? "");
    setSort(params.get("sort") ?? "newest");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  const onApply = () => {
    const sp = new URLSearchParams(params.toString());
    q ? sp.set("q", q) : sp.delete("q");
    category ? sp.set("category", category) : sp.delete("category");
    sort ? sp.set("sort", sort) : sp.delete("sort");
    sp.set("page", "1");
    router.push(`${pathname}?${sp.toString()}`);
  };

  const onClear = () => {
    router.push(pathname);
    setQ(""); setCategory(""); setSort("newest");
  };

  const options = useMemo(() => [{ slug: "", name: "All Categories" }, ...categories], [categories]);

  return (
    <section aria-labelledby="filters-heading" className="rounded-lg border p-4">
      <h2 id="filters-heading" className="sr-only">Filters</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="q" className="mb-1 block text-sm font-medium">Search</label>
          <input id="q" className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                 placeholder="Search services…" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">Category</label>
          <select id="category" className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={category} onChange={(e)=>setCategory(e.target.value)}>
            {options.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="mb-1 block text-sm font-medium">Sort by</label>
          <select id="sort" className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={onApply}
                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
          Apply filters
        </button>
        <button type="button" onClick={onClear}
                className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium">
          Clear
        </button>
      </div>
    </section>
  );
}
