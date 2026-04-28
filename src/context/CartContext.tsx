import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { CartItem } from "../types";
import { PRODUCTS, PROMO_CODES } from "../data/products";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string | null;
  promoLabel: string | null;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("aurum:cart", []);
  const [promoCode, setPromoCode] = useLocalStorage<string | null>("aurum:promo", null);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (next: CartItem) => {
      setItems((prev) => {
        const idx = prev.findIndex(
          (it) => it.productId === next.productId && it.size === next.size && it.color === next.color,
        );
        if (idx >= 0) {
          const copy = prev.slice();
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + next.quantity };
          return copy;
        }
        return [...prev, next];
      });
      setIsOpen(true);
    },
    [setItems, setIsOpen],
  );

  const removeItem = useCallback(
    (productId: string, size: string, color: string) => {
      setItems((prev) =>
        prev.filter((it) => !(it.productId === productId && it.size === size && it.color === color)),
      );
    },
    [setItems],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      setItems((prev) =>
        prev.map((it) =>
          it.productId === productId && it.size === size && it.color === color
            ? { ...it, quantity }
            : it,
        ),
      );
    },
    [setItems, removeItem],
  );

  const clear = useCallback(() => {
    setItems([]);
    setPromoCode(null);
  }, [setItems, setPromoCode]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const product = PRODUCTS.find((p) => p.id === it.productId);
      return sum + (product?.price ?? 0) * it.quantity;
    }, 0);
  }, [items]);

  const count = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  const promo = promoCode ? PROMO_CODES[promoCode] : null;
  const promoLabel = promo?.label ?? null;

  let discount = 0;
  let shipping = subtotal === 0 ? 0 : subtotal >= 80 ? 0 : 8;

  if (promo) {
    if (promo.type === "percent") {
      discount = Math.round(subtotal * (promo.value / 100) * 100) / 100;
    } else if (promo.type === "fixed") {
      if (promoCode === "FREESHIP") {
        shipping = 0;
      } else {
        discount = Math.min(promo.value, subtotal);
      }
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);

  const applyPromo = useCallback(
    (code: string) => {
      const upper = code.trim().toUpperCase();
      if (!PROMO_CODES[upper]) {
        return { ok: false, message: "Invalid code" };
      }
      setPromoCode(upper);
      return { ok: true, message: `Applied: ${PROMO_CODES[upper].label}` };
    },
    [setPromoCode],
  );

  const removePromo = useCallback(() => setPromoCode(null), [setPromoCode]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    count,
    subtotal,
    shipping,
    discount,
    total,
    promoCode,
    promoLabel,
    applyPromo,
    removePromo,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((v) => !v),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
