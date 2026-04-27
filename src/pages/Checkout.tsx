import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PRODUCTS } from "../data/products";
import { formatPrice, cx } from "../lib/format";
import type { Order, ShippingAddress } from "../types";

const STEPS = ["Information", "Shipping", "Payment"] as const;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, discount, promoCode, clear } = useCart();
  const { user, addOrder } = useAuth();
  const [step, setStep] = useState<(typeof STEPS)[number]>("Information");

  const [email, setEmail] = useState(user?.email ?? "");
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name ?? "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
  });
  const [shipMethod, setShipMethod] = useState<"standard" | "express">("standard");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  if (items.length === 0 && !placed) return <Navigate to="/cart" replace />;

  const finalShipping = shipMethod === "express" ? 18 : shipping;
  const finalTotal = Math.max(0, subtotal - discount + finalShipping);

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 700));
    const order: Order = {
      id: `AURUM-${Date.now().toString().slice(-7)}`,
      userId: user?.id ?? null,
      email,
      items: items.map((it) => {
        const p = PRODUCTS.find((x) => x.id === it.productId)!;
        return {
          ...it,
          name: p.name,
          price: p.price,
          image: p.images[0],
        };
      }),
      subtotal,
      shipping: finalShipping,
      discount,
      discountCode: promoCode ?? undefined,
      total: finalTotal,
      shippingAddress: address,
      status: "Processing",
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    setPlaced(true);
    navigate(`/order-confirmation/${order.id}`, { state: { order }, replace: true });
    clear();
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 lg:px-8 py-12">
      <Link to="/" className="display text-2xl tracking-[0.3em] block text-center mb-8">
        AURUM
      </Link>

      {/* Stepper */}
      <ol className="flex items-center justify-center gap-3 sm:gap-6 mb-12 text-[11px] tracking-[0.2em] uppercase text-clay">
        {STEPS.map((s, i) => {
          const done = STEPS.indexOf(step) > i;
          const active = step === s;
          return (
            <li key={s} className="flex items-center gap-3 sm:gap-6">
              <span
                className={cx(
                  "h-7 w-7 grid place-items-center border rounded-full text-[11px]",
                  active ? "bg-ink text-bone border-ink" : done ? "bg-bone border-ink text-ink" : "border-neutral-300",
                )}
              >
                {done ? <Check size={12} /> : i + 1}
              </span>
              <span className={cx(active ? "text-ink" : "")}>{s}</span>
              {i < STEPS.length - 1 && <span className="text-neutral-300">·</span>}
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-8">
          {/* Information */}
          {step === "Information" && (
            <section className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-medium">Contact Information</h2>
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-ink"
                  placeholder="you@example.com"
                />
              </Field>

              <h2 className="text-lg font-medium pt-3">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name">
                  <Input value={address.fullName} onChange={(v) => setAddress({ ...address, fullName: v })} />
                </Field>
                <Field label="Phone">
                  <Input value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
                </Field>
              </div>
              <Field label="Address line 1">
                <Input value={address.address1} onChange={(v) => setAddress({ ...address, address1: v })} />
              </Field>
              <Field label="Address line 2 (optional)">
                <Input value={address.address2 ?? ""} onChange={(v) => setAddress({ ...address, address2: v })} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="City">
                  <Input value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                </Field>
                <Field label="State / Province">
                  <Input value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
                </Field>
                <Field label="ZIP">
                  <Input value={address.zip} onChange={(v) => setAddress({ ...address, zip: v })} />
                </Field>
              </div>
              <Field label="Country">
                <Input value={address.country} onChange={(v) => setAddress({ ...address, country: v })} />
              </Field>

              <button
                onClick={() => setStep("Shipping")}
                disabled={!email || !address.fullName || !address.address1 || !address.city || !address.zip}
                className="bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-clay transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue to Shipping
              </button>
            </section>
          )}

          {/* Shipping */}
          {step === "Shipping" && (
            <section className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-medium">Shipping Method</h2>
              {[
                { id: "standard", label: "Standard Shipping", desc: "3–7 business days", price: subtotal >= 80 ? 0 : 8 },
                { id: "express", label: "Express Shipping", desc: "1–2 business days", price: 18 },
              ].map((opt) => {
                const active = shipMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setShipMethod(opt.id as "standard" | "express")}
                    className={cx(
                      "w-full flex items-center justify-between border p-4 text-left transition-colors",
                      active ? "border-ink ring-2 ring-ink ring-offset-2" : "border-neutral-300 hover:border-ink",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-clay mt-1">{opt.desc}</p>
                    </div>
                    <span className="text-sm font-medium">{opt.price === 0 ? "Free" : formatPrice(opt.price)}</span>
                  </button>
                );
              })}
              <div className="flex justify-between gap-3 pt-4">
                <button onClick={() => setStep("Information")} className="text-[11px] tracking-[0.25em] uppercase text-clay hover:text-ink">
                  ← Back
                </button>
                <button
                  onClick={() => setStep("Payment")}
                  className="bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-clay transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </section>
          )}

          {/* Payment */}
          {step === "Payment" && (
            <section className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 text-xs text-clay">
                <Lock size={14} /> Your information is encrypted. This is a demo — no real payment is processed.
              </div>
              <Field label="Cardholder name">
                <Input value={card.name} onChange={(v) => setCard({ ...card, name: v })} placeholder="As shown on card" />
              </Field>
              <Field label="Card number">
                <Input
                  value={card.number}
                  onChange={(v) => setCard({ ...card, number: v.replace(/[^\d ]/g, "").slice(0, 19) })}
                  placeholder="0000 0000 0000 0000"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry">
                  <Input
                    value={card.expiry}
                    onChange={(v) => setCard({ ...card, expiry: v.replace(/[^\d/]/g, "").slice(0, 5) })}
                    placeholder="MM / YY"
                  />
                </Field>
                <Field label="CVC">
                  <Input
                    value={card.cvc}
                    onChange={(v) => setCard({ ...card, cvc: v.replace(/\D/g, "").slice(0, 4) })}
                    placeholder="123"
                  />
                </Field>
              </div>
              <div className="flex justify-between gap-3 pt-4">
                <button onClick={() => setStep("Shipping")} className="text-[11px] tracking-[0.25em] uppercase text-clay hover:text-ink">
                  ← Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={placing || !card.number || !card.expiry || !card.cvc || !card.name}
                  className="bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-clay transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {placing ? "Placing order…" : `Pay ${formatPrice(finalTotal)}`}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Summary */}
        <aside className="bg-bone p-6 lg:p-8 self-start">
          <h2 className="text-[12px] tracking-[0.25em] uppercase font-medium mb-5">Order Summary</h2>
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {items.map((it) => {
              const p = PRODUCTS.find((x) => x.id === it.productId);
              if (!p) return null;
              return (
                <div key={`${it.productId}-${it.size}-${it.color}`} className="flex gap-3">
                  <div className="relative w-16 h-20 bg-sand flex-shrink-0">
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-ink text-bone text-[10px] rounded-full h-5 w-5 grid place-items-center">
                      {it.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-clay mt-0.5">{it.color} · {it.size}</p>
                  </div>
                  <span className="text-sm whitespace-nowrap">{formatPrice(p.price * it.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-300 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-clay">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sale">
                <span>Discount {promoCode && `(${promoCode})`}</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-clay">Shipping</span>
              <span>{finalShipping === 0 ? "Free" : formatPrice(finalShipping)}</span>
            </div>
            <div className="flex justify-between text-base font-medium pt-3 mt-3 border-t border-neutral-300">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.2em] uppercase text-clay mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-ink"
    />
  );
}
