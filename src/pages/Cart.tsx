import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { PRODUCTS } from "../data/products";
import { formatPrice } from "../lib/format";
import { useState } from "react";

export default function Cart() {
  const {
    items,
    subtotal,
    shipping,
    discount,
    total,
    promoCode,
    promoLabel,
    applyPromo,
    removePromo,
    updateQuantity,
    removeItem,
  } = useCart();

  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const onApply = () => {
    if (!code.trim()) return;
    const r = applyPromo(code);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) setCode("");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-24 text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-4">Your bag</p>
        <h1 className="display text-5xl mb-4">Your bag is empty.</h1>
        <p className="text-clay mb-8">Discover what's new — start with our latest arrivals.</p>
        <Link
          to="/new"
          className="inline-flex items-center gap-2 bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-clay transition-colors"
        >
          Shop New <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12 lg:py-16">
      <h1 className="display text-4xl lg:text-5xl mb-10">Your Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        <div>
          <div className="border-t border-neutral-200">
            {items.map((it) => {
              const product = PRODUCTS.find((p) => p.id === it.productId);
              if (!product) return null;
              return (
                <div
                  key={`${it.productId}-${it.size}-${it.color}`}
                  className="py-6 flex gap-4 sm:gap-6 border-b border-neutral-200"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className="block w-24 sm:w-32 aspect-[3/4] bg-sand flex-shrink-0 overflow-hidden"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/product/${product.slug}`} className="font-medium pr-2">
                        {product.name}
                      </Link>
                      <span className="whitespace-nowrap">
                        {formatPrice(product.price * it.quantity)}
                      </span>
                    </div>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-clay mt-1">
                      {it.color} · Size {it.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border border-neutral-300">
                        <button
                          onClick={() => updateQuantity(it.productId, it.size, it.color, it.quantity - 1)}
                          className="p-2 hover:bg-bone"
                          aria-label="Decrease"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-sm">{it.quantity}</span>
                        <button
                          onClick={() => updateQuantity(it.productId, it.size, it.color, it.quantity + 1)}
                          className="p-2 hover:bg-bone"
                          aria-label="Increase"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(it.productId, it.size, it.color)}
                        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-clay hover:text-ink"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="bg-bone p-6 lg:p-8 self-start">
          <h2 className="text-[12px] tracking-[0.25em] uppercase font-medium mb-5">Order Summary</h2>

          {/* Promo */}
          <div className="mb-6">
            {promoCode ? (
              <div className="flex items-center justify-between bg-white border border-ink p-3">
                <div>
                  <p className="text-xs tracking-[0.18em] uppercase font-medium">{promoCode}</p>
                  <p className="text-xs text-clay mt-0.5">{promoLabel}</p>
                </div>
                <button
                  onClick={() => removePromo()}
                  className="text-xs tracking-[0.2em] uppercase text-clay hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="flex">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 bg-white border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-ink"
                  />
                  <button
                    onClick={onApply}
                    className="bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-5 hover:bg-clay transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[11px] text-clay mt-2">
                  Try <span className="font-medium">WELCOME10</span> or{" "}
                  <span className="font-medium">FREESHIP</span>
                </p>
                {msg && (
                  <p className={`text-xs mt-2 ${msg.ok ? "text-clay" : "text-sale"}`}>
                    {msg.text}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2 text-sm border-t border-neutral-300 pt-5">
            <div className="flex justify-between">
              <span className="text-clay">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sale">
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-clay">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-medium pt-3 mt-3 border-t border-neutral-300">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block text-center bg-ink text-bone text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-clay transition-colors"
          >
            Checkout
          </Link>
          <Link
            to="/new"
            className="mt-3 block text-center text-[11px] tracking-[0.2em] uppercase text-clay hover:text-ink transition-colors"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
