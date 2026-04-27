import { Link, Navigate } from "react-router-dom";
import { Package, Heart, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/format";

export default function Account() {
  const { user, logout, orders } = useAuth();
  const { ids } = useWishlist();

  if (!user) return <Navigate to="/login" replace />;

  const myOrders = orders.filter((o) => o.userId === user.id || o.email === user.email);

  return (
    <div className="mx-auto max-w-[1000px] px-4 lg:px-8 py-12 lg:py-16">
      <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-2">Account</p>
      <h1 className="display text-4xl lg:text-5xl mb-2">Hello, {user.name.split(" ")[0]}.</h1>
      <p className="text-clay mb-12">Welcome back. Here's a snapshot of your account.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Stat icon={<Package size={18} />} label="Orders" value={myOrders.length} to="#orders" />
        <Stat icon={<Heart size={18} />} label="Wishlist" value={ids.length} to="/wishlist" />
        <button
          onClick={logout}
          className="border border-neutral-200 hover:border-ink p-6 text-left flex items-start justify-between transition-colors"
        >
          <div>
            <div className="text-clay mb-2"><LogOut size={18} /></div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-clay">Sign out</p>
            <p className="text-base font-medium mt-1">{user.email}</p>
          </div>
        </button>
      </div>

      <section id="orders">
        <h2 className="display text-3xl mb-6">Order History</h2>
        {myOrders.length === 0 ? (
          <div className="border border-dashed border-neutral-300 p-10 text-center">
            <p className="text-clay mb-4">You haven't placed any orders yet.</p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase border-b border-ink pb-1 hover:text-clay hover:border-clay"
            >
              Start shopping <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="border-t border-neutral-200">
            {myOrders.map((o) => (
              <Link
                key={o.id}
                to={`/order-confirmation/${o.id}`}
                className="block py-5 border-b border-neutral-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-clay mb-1">
                      Order #{o.id} · {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-medium">
                      {o.items.length} item{o.items.length > 1 ? "s" : ""} · {formatPrice(o.total)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] tracking-[0.2em] uppercase bg-bone px-3 py-1.5">
                      {o.status}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-clay group-hover:text-ink group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {o.items.slice(0, 5).map((it, i) => (
                    <div key={i} className="w-12 h-14 bg-sand">
                      <img src={it.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value, to }: { icon: React.ReactNode; label: string; value: number; to: string }) {
  return (
    <Link
      to={to}
      className="border border-neutral-200 hover:border-ink p-6 flex items-start justify-between transition-colors group"
    >
      <div>
        <div className="text-clay mb-2">{icon}</div>
        <p className="text-[11px] tracking-[0.2em] uppercase text-clay">{label}</p>
        <p className="display text-3xl mt-1">{value}</p>
      </div>
      <ArrowRight size={16} className="text-clay group-hover:text-ink group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
