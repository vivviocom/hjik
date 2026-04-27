import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "../types";
import { formatPrice, cx } from "../lib/format";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const inWish = has(product.id);
  const onSale = !!product.compareAt;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      size: product.sizes[Math.floor(product.sizes.length / 2)],
      color: product.colors[0].name,
      quantity: 1,
    });
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="relative overflow-hidden bg-sand aspect-[3/4]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {onSale && (
            <span className="bg-sale text-bone text-[10px] tracking-[0.18em] uppercase px-2 py-1">
              Sale
            </span>
          )}
          {product.collections.includes("new") && !onSale && (
            <span className="bg-ink text-bone text-[10px] tracking-[0.18em] uppercase px-2 py-1">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 h-9 w-9 grid place-items-center bg-white/85 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={cx("transition-colors", inWish ? "fill-ink text-ink" : "text-ink")}
          />
        </button>

        {/* Quick add — desktop hover */}
        <button
          type="button"
          onClick={quickAdd}
          className="hidden lg:block absolute bottom-3 left-3 right-3 bg-ink text-bone text-[11px] tracking-[0.2em] uppercase py-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-clay"
        >
          Quick Add
        </button>
      </div>

      <div className="pt-3 pb-1 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-sans font-medium truncate">{product.name}</h3>
          <p className="text-[11px] text-clay tracking-[0.1em] uppercase mt-0.5">
            {product.colors.length} color{product.colors.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-[13px] text-right whitespace-nowrap">
          {onSale ? (
            <>
              <span className="text-sale font-medium">{formatPrice(product.price)}</span>
              <span className="ml-2 text-clay line-through">{formatPrice(product.compareAt!)}</span>
            </>
          ) : (
            <span>{formatPrice(product.price)}</span>
          )}
        </div>
      </div>

      {/* Color swatches */}
      <div className="flex items-center gap-1.5 mt-1">
        {product.colors.slice(0, 4).map((c) => (
          <span
            key={c.name}
            className="h-3 w-3 rounded-full border border-neutral-300"
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
        {product.colors.length > 4 && (
          <span className="text-[10px] text-clay">+{product.colors.length - 4}</span>
        )}
      </div>
    </Link>
  );
}
