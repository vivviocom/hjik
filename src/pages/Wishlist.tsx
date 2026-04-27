import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "../components/ProductCard";

export default function Wishlist() {
  const { ids, clear } = useWishlist();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12 lg:py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-3">Saved for later</p>
          <h1 className="display text-4xl lg:text-5xl">Wishlist</h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-[11px] tracking-[0.2em] uppercase text-clay hover:text-ink"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 mx-auto rounded-full bg-bone grid place-items-center mb-6">
            <Heart className="text-ink" />
          </div>
          <p className="display text-3xl mb-3">Your wishlist is empty.</p>
          <p className="text-clay mb-8">Tap the heart on products you love to save them here.</p>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-clay transition-colors"
          >
            Browse New <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
