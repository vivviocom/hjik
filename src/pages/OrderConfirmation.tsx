import { Link, useLocation, useParams, Navigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import type { Order } from "../types";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { orders } = useAuth();
  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const order = stateOrder ?? orders.find((o) => o.id === id);

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-16 lg:py-24">
      <div className="text-center mb-12">
        <div className="h-16 w-16 mx-auto rounded-full bg-bone grid place-items-center mb-6">
          <Check className="text-ink" />
        </div>
        <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-2">Order Confirmed</p>
        <h1 className="display text-4xl lg:text-5xl mb-3">Thank you, {order.shippingAddress.fullName.split(" ")[0]}.</h1>
        <p className="text-clay">
          We've sent a confirmation to <span className="text-ink">{order.email}</span>.
        </p>
        <p className="text-[12px] tracking-[0.2em] uppercase text-clay mt-3">
          Order #{order.id}
        </p>
      </div>

      <div className="border-t border-b border-neutral-200 divide-y divide-neutral-200">
        {order.items.map((it, i) => (
          <div key={i} className="py-5 flex gap-4">
            <div className="w-20 h-24 bg-sand flex-shrink-0 overflow-hidden">
              <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{it.name}</p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-clay mt-1">
                {it.color} · {it.size} · Qty {it.quantity}
              </p>
            </div>
            <span className="self-center">{formatPrice(it.price * it.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3">Shipping To</h3>
          <p className="text-sm text-clay leading-relaxed">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.address1}{order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ""}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div>
          <h3 className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3">Summary</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-clay">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sale"><span>Discount</span><span>−{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-clay">Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between font-medium border-t border-neutral-200 pt-2 mt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/account"
          className="inline-flex items-center justify-center gap-2 bg-ink text-bone text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-clay transition-colors"
        >
          View Order History <ArrowRight size={14} />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 border border-ink text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-ink hover:text-bone transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
