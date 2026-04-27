import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Heart, Star, ChevronDown, Truck, RotateCcw, Shield } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice, cx } from "../lib/format";
import { ProductCard } from "../components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(product?.colors[0].name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("details");

  const related = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.id !== product.id)
      .filter((p) => p.tags.some((t) => product.tags.includes(t)) || p.category === product.category)
      .slice(0, 4);
  }, [product]);

  if (!product) return <Navigate to="/" replace />;

  const onSale = !!product.compareAt;
  const inWish = has(product.id);

  const onAdd = () => {
    if (!size) {
      setOpenSection("size-required");
      return;
    }
    addItem({ productId: product.id, size, color, quantity: 1 });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="text-[11px] tracking-[0.2em] uppercase text-clay mb-8 flex gap-2">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link to={`/${product.category === "unisex" ? "new" : product.category}`} className="hover:text-ink">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery */}
        <div className="flex gap-4">
          <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cx(
                  "aspect-[3/4] bg-sand overflow-hidden border-2 transition-colors",
                  i === activeImg ? "border-ink" : "border-transparent hover:border-neutral-300",
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <div className="aspect-[3/4] bg-sand overflow-hidden">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover animate-fade-in"
                key={activeImg}
              />
            </div>
            <div className="lg:hidden flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cx(
                    "h-20 w-16 flex-shrink-0 bg-sand border-2 overflow-hidden",
                    i === activeImg ? "border-ink" : "border-transparent",
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={cx(
                  i < Math.round(product.rating) ? "fill-ink text-ink" : "text-neutral-300",
                )}
              />
            ))}
            <span className="text-xs text-clay ml-2">
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </div>

          <h1 className="display text-3xl lg:text-4xl mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className={cx("text-xl", onSale && "text-sale font-medium")}>
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-base text-clay line-through">
                {formatPrice(product.compareAt!)}
              </span>
            )}
          </div>

          <p className="text-clay leading-relaxed mb-8 text-[15px]">{product.description}</p>

          {/* Color */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] tracking-[0.25em] uppercase">Color</span>
              <span className="text-xs text-clay">{color}</span>
            </div>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={cx(
                    "h-10 w-10 rounded-full border-2 transition-all",
                    color === c.name ? "border-ink ring-2 ring-ink ring-offset-2" : "border-neutral-300 hover:border-ink",
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] tracking-[0.25em] uppercase">Size</span>
              <Link to="/policies/sizing" className="text-[11px] tracking-[0.2em] uppercase underline-offset-2 hover:underline text-clay">
                Size Guide
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setOpenSection("details");
                  }}
                  className={cx(
                    "h-12 text-sm border transition-colors",
                    size === s
                      ? "bg-ink text-bone border-ink"
                      : "bg-white text-ink border-neutral-300 hover:border-ink",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {openSection === "size-required" && (
              <p className="mt-2 text-xs text-sale">Please select a size.</p>
            )}
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={onAdd}
              className="flex-1 bg-ink text-bone text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-clay transition-colors"
            >
              Add to Bag
            </button>
            <button
              onClick={() => toggle(product.id)}
              aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
              className={cx(
                "h-14 w-14 grid place-items-center border transition-colors",
                inWish ? "bg-ink text-bone border-ink" : "border-neutral-300 hover:border-ink",
              )}
            >
              <Heart size={18} className={cx(inWish && "fill-bone")} />
            </button>
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-neutral-200 mb-6 text-[10px] tracking-[0.18em] uppercase text-clay">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck size={16} className="text-ink" /> Free Ship $80+
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw size={16} className="text-ink" /> 30-Day Returns
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Shield size={16} className="text-ink" /> Secure Checkout
            </div>
          </div>

          {/* Accordions */}
          <Accordion
            title="Details & Care"
            open={openSection === "details"}
            onToggle={() => setOpenSection(openSection === "details" ? null : "details")}
          >
            <ul className="space-y-1.5 text-sm text-clay">
              {product.details.map((d) => (
                <li key={d}>· {d}</li>
              ))}
              <li>· Material: {product.material}</li>
            </ul>
          </Accordion>
          <Accordion
            title="Shipping & Returns"
            open={openSection === "ship"}
            onToggle={() => setOpenSection(openSection === "ship" ? null : "ship")}
          >
            <p className="text-sm text-clay leading-relaxed">
              Standard shipping is free for orders over $80 and arrives within 3–7 business days.
              Express options available at checkout. We accept returns within 30 days of delivery —
              items must be unworn with original tags.
            </p>
          </Accordion>
          <Accordion
            title={`Reviews (${product.reviews.length})`}
            open={openSection === "reviews"}
            onToggle={() => setOpenSection(openSection === "reviews" ? null : "reviews")}
          >
            {product.reviews.length === 0 ? (
              <p className="text-sm text-clay">No reviews yet — be the first.</p>
            ) : (
              <div className="space-y-5">
                {product.reviews.map((r) => (
                  <div key={r.id} className="pb-4 border-b border-neutral-100 last:border-none">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={cx(i < r.rating ? "fill-ink text-ink" : "text-neutral-300")}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-sm text-clay mt-1">{r.body}</p>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-clay mt-2">
                      {r.author} · {r.date}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Accordion>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="display text-3xl mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[12px] tracking-[0.2em] uppercase font-medium">{title}</span>
        <ChevronDown
          size={16}
          className={cx("transition-transform", open && "rotate-180")}
        />
      </button>
      <div
        className={cx(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
