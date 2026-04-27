import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { PRODUCTS } from "../data/products";
import { formatPrice, cx } from "../lib/format";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, count, subtotal, shipping, total, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={cx(
        "fixed inset-0 z-50 transition-opacity",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <aside
        className={cx(
          "absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-400 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-200">
          <span className="text-[12px] tracking-[0.25em] uppercase font-medium">
            Cart ({count})
          </span>
          <button onClick={closeCart} aria-label="Close cart" className="p-2 -mr-2">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
            <div className="display text-2xl">Your bag is empty.</div>
            <p className="text-clay text-sm max-w-xs">
              Looks like you haven't added anything yet. Browse our latest drops.
            </p>
            <Link
              to="/new"
              onClick={closeCart}
              className="mt-2 bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-clay transition-colors"
            >
              Shop New
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 divide-y divide-neutral-200">
              {items.map((it, idx) => {
                const product = PRODUCTS.find((p) => p.id === it.productId);
                if (!product) return null;
                return (
                  <div key={idx} className="py-5 flex gap-4">
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="block w-20 h-24 bg-sand flex-shrink-0 overflow-hidden"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium leading-snug pr-2"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(it.productId, it.size, it.color)}
                          aria-label="Remove"
                          className="p-1 -mr-1 text-clay hover:text-ink transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-clay tracking-[0.1em] uppercase mt-1">
                        {it.color} · {it.size}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center border border-neutral-300">
                          <button
                            onClick={() => updateQuantity(it.productId, it.size, it.color, it.quantity - 1)}
                            className="p-1.5 hover:bg-bone transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs">{it.quantity}</span>
                          <button
                            onClick={() => updateQuantity(it.productId, it.size, it.color, it.quantity + 1)}
                            className="p-1.5 hover:bg-bone transition-colors"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm">{formatPrice(product.price * it.quantity)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-neutral-200 p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-clay">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-clay">
                  {shipping === 0 && subtotal > 0 ? "Shipping (free)" : "Shipping"}
                </span>
                <span>{shipping === 0 ? "—" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-3 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block text-center bg-ink text-bone text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-clay transition-colors"
              >
                Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-center text-[11px] tracking-[0.2em] uppercase py-2 text-clay hover:text-ink transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
