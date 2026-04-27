import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";

const HERO_BG =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80";
const COLLAGE_W =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80";
const COLLAGE_M =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80";

export default function Home() {
  const newArrivals = PRODUCTS.filter((p) => p.collections.includes("new")).slice(0, 8);
  const bestSellers = PRODUCTS.filter((p) => p.collections.includes("best")).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[88svh] min-h-[600px] w-full overflow-hidden bg-sand">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1400px] h-full px-4 lg:px-8 flex flex-col justify-end pb-16 lg:pb-24">
          <div className="max-w-xl text-bone animate-fade-up">
            <p className="text-[11px] tracking-[0.3em] uppercase mb-4 opacity-80">Spring / Summer Drop</p>
            <h1 className="display text-5xl lg:text-7xl leading-[0.95] mb-6">
              Built for the everyday.
            </h1>
            <p className="text-base lg:text-lg max-w-md mb-8 opacity-90">
              Modern essentials, designed to last. Heavyweight cotton, considered cuts, and
              a palette that goes anywhere.
            </p>
            <div className="flex gap-3">
              <Link
                to="/new"
                className="inline-flex items-center gap-2 bg-bone text-ink text-[11px] tracking-[0.25em] uppercase px-7 py-4 hover:bg-white transition-colors group"
              >
                Shop New <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/best"
                className="inline-flex items-center gap-2 border border-bone text-bone text-[11px] tracking-[0.25em] uppercase px-7 py-4 hover:bg-bone hover:text-ink transition-colors"
              >
                Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-ink text-bone py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-12 pr-12 text-[11px] tracking-[0.3em] uppercase">
              {[
                "Free shipping over $80",
                "Worldwide delivery",
                "Easy 30-day returns",
                "Use code WELCOME10",
                "Sustainable materials",
              ].map((t) => (
                <span key={t}>· {t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-3">Just dropped</p>
            <h2 className="display text-4xl lg:text-5xl">New Arrivals</h2>
          </div>
          <Link to="/new" className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase hover:text-clay transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* CATEGORY COLLAGE */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {[
            { to: "/women", label: "Women", img: COLLAGE_W },
            { to: "/men", label: "Men", img: COLLAGE_M },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="relative h-[480px] md:h-[640px] overflow-hidden bg-sand group"
            >
              <img
                src={c.img}
                alt={c.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
              <div className="absolute bottom-8 left-8 text-bone">
                <p className="text-[11px] tracking-[0.3em] uppercase mb-2 opacity-80">Shop</p>
                <h3 className="display text-4xl lg:text-5xl">{c.label}</h3>
                <span className="inline-flex items-center gap-2 mt-3 text-[11px] tracking-[0.25em] uppercase border-b border-bone pb-1 group-hover:border-clay transition-colors">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-bone py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-3">Most loved</p>
              <h2 className="display text-4xl lg:text-5xl">Best Sellers</h2>
            </div>
            <Link to="/best" className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase hover:text-clay transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {bestSellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?auto=format&fit=crop&w=1400&q=80"
            alt=""
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="max-w-md">
            <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-4">Made considered</p>
            <h2 className="display text-4xl lg:text-5xl mb-6">Quality, without compromise.</h2>
            <p className="text-base text-clay leading-relaxed mb-6">
              Every AURUM piece is designed in-house and produced in small runs across our partner
              workshops in Portugal and Türkiye. Heavyweight organic cottons, refined hardware, and
              the kind of fits that get better with wear.
            </p>
            <Link to="/policies/contact" className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors">
              Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
