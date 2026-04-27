import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";
import type { Category, Product } from "../types";
import { cx } from "../lib/format";

interface ListingProps {
  title: string;
  subtitle?: string;
  filter?: (p: Product) => boolean;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "36", "6", "7", "8", "9", "10", "11", "12"];
const PRICE_RANGES = [
  { id: "0-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 – $200", min: 100, max: 200 },
  { id: "200+", label: "$200+", min: 200, max: Infinity },
];
const CATEGORIES: { id: Category; label: string }[] = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "unisex", label: "Unisex" },
];
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
  { id: "rating", label: "Top Rated" },
];

export default function Listing({ title, subtitle, filter }: ListingProps) {
  const [params, setParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const sort = params.get("sort") ?? "featured";
  const sizes = params.getAll("size");
  const cats = params.getAll("cat") as Category[];
  const range = params.get("range");
  const q = params.get("q") ?? "";

  const setMulti = (key: string, val: string, on: boolean) => {
    const next = new URLSearchParams(params);
    const existing = next.getAll(key);
    next.delete(key);
    const updated = on ? [...existing, val] : existing.filter((v) => v !== val);
    updated.forEach((v) => next.append(key, v));
    setParams(next, { replace: true });
  };

  const setSingle = (key: string, val: string | null) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = filter ? PRODUCTS.filter(filter) : PRODUCTS.slice();
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)),
      );
    }
    if (cats.length) list = list.filter((p) => cats.includes(p.category));
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (range) {
      const r = PRICE_RANGES.find((x) => x.id === range);
      if (r) list = list.filter((p) => p.price >= r.min && p.price < r.max);
    }
    switch (sort) {
      case "price-asc":
        list = list.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = list.slice().sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = list.slice().sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        list = list.slice().sort((a, b) => Number(b.collections.includes("new")) - Number(a.collections.includes("new")));
        break;
    }
    return list;
  }, [filter, sort, sizes, cats, range, q]);

  const activeCount = sizes.length + cats.length + (range ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12 lg:py-16">
      <div className="mb-10 lg:mb-12">
        {subtitle && (
          <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-3">{subtitle}</p>
        )}
        <h1 className="display text-4xl lg:text-6xl">{title}</h1>
        <p className="text-clay text-sm mt-3">{filtered.length} products</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <button
          onClick={() => setFilterOpen(true)}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase hover:text-clay transition-colors"
        >
          <Filter size={14} /> Filter{activeCount > 0 && ` (${activeCount})`}
        </button>
        <select
          value={sort}
          onChange={(e) => setSingle("sort", e.target.value === "featured" ? null : e.target.value)}
          className="bg-transparent text-[11px] tracking-[0.25em] uppercase border-none outline-none cursor-pointer"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-10 mt-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            cats={cats}
            sizes={sizes}
            range={range}
            setMulti={setMulti}
            setSingle={setSingle}
          />
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-clay">
              <p className="display text-3xl text-ink mb-3">Nothing matched.</p>
              <p>Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cx(
          "fixed inset-0 z-50 lg:hidden transition-opacity",
          filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
        <div
          className={cx(
            "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300",
            filterOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-200">
            <span className="text-[12px] tracking-[0.25em] uppercase font-medium">Filters</span>
            <button onClick={() => setFilterOpen(false)} className="p-2 -mr-2" aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterPanel
              cats={cats}
              sizes={sizes}
              range={range}
              setMulti={setMulti}
              setSingle={setSingle}
            />
          </div>
          <div className="p-5 border-t border-neutral-200">
            <button
              onClick={() => setFilterOpen(false)}
              className="w-full bg-ink text-bone text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-clay transition-colors"
            >
              View {filtered.length} Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  cats,
  sizes,
  range,
  setMulti,
  setSingle,
}: {
  cats: Category[];
  sizes: string[];
  range: string | null;
  setMulti: (key: string, val: string, on: boolean) => void;
  setSingle: (key: string, val: string | null) => void;
}) {
  return (
    <div className="space-y-8">
      <FilterSection label="Category">
        {CATEGORIES.map((c) => (
          <label key={c.id} className="flex items-center gap-3 py-1.5 cursor-pointer text-sm hover:text-clay">
            <input
              type="checkbox"
              checked={cats.includes(c.id)}
              onChange={(e) => setMulti("cat", c.id, e.target.checked)}
              className="accent-ink"
            />
            {c.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection label="Price">
        {PRICE_RANGES.map((r) => (
          <label key={r.id} className="flex items-center gap-3 py-1.5 cursor-pointer text-sm hover:text-clay">
            <input
              type="radio"
              name="range"
              checked={range === r.id}
              onChange={() => setSingle("range", r.id)}
              className="accent-ink"
            />
            {r.label}
          </label>
        ))}
        {range && (
          <button
            onClick={() => setSingle("range", null)}
            className="text-[11px] tracking-[0.2em] uppercase text-clay hover:text-ink mt-2"
          >
            Clear
          </button>
        )}
      </FilterSection>

      <FilterSection label="Size">
        <div className="flex flex-wrap gap-2 pt-1">
          {ALL_SIZES.map((s) => {
            const on = sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setMulti("size", s, !on)}
                className={cx(
                  "h-9 min-w-9 px-2 text-[12px] border transition-colors",
                  on
                    ? "bg-ink text-bone border-ink"
                    : "bg-white text-ink border-neutral-300 hover:border-ink",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3">{label}</h3>
      <div>{children}</div>
    </div>
  );
}


