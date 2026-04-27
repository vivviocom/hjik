import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { cx } from "../lib/format";

const NAV = [
  { to: "/men", label: "Men" },
  { to: "/women", label: "Women" },
  { to: "/new", label: "New Arrivals" },
  { to: "/best", label: "Best Sellers" },
  { to: "/sale", label: "Sale", accent: true },
];

export function Navbar() {
  const { count, openCart } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <div className="bg-ink text-bone text-[11px] tracking-[0.18em] uppercase py-2 text-center">
        Free shipping on orders over $80 · Use code WELCOME10 for 10% off
      </div>

      <header
        className={cx(
          "sticky top-0 z-40 bg-white/85 backdrop-blur transition-all duration-300",
          scrolled ? "border-b border-neutral-200 shadow-[0_1px_0_rgba(0,0,0,0.04)]" : "",
        )}
      >
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden -ml-2 p-2"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <nav className="hidden lg:flex items-center gap-8 flex-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    cx(
                      "text-[12px] tracking-[0.2em] uppercase transition-colors hover:text-ink",
                      isActive ? "text-ink" : "text-clay",
                      n.accent && "!text-sale",
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>

            <Link
              to="/"
              className="display text-2xl lg:text-[28px] tracking-[0.3em] absolute left-1/2 -translate-x-1/2"
              aria-label="AURUM home"
            >
              AURUM
            </Link>

            <div className="flex items-center gap-1 lg:gap-2 lg:flex-1 lg:justify-end">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <Link
                to={user ? "/account" : "/login"}
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Account"
              >
                <User size={18} />
              </Link>
              <Link
                to="/wishlist"
                className="p-2 hover:opacity-60 transition-opacity hidden sm:flex relative"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {ids.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-ink text-bone text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {ids.length}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={openCart}
                className="p-2 hover:opacity-60 transition-opacity relative"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {count > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-ink text-bone text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-t border-neutral-200 animate-fade-in">
            <form onSubmit={onSearch} className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6 flex items-center gap-4">
              <Search size={18} className="text-clay" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories…"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-clay"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      <div
        className={cx(
          "fixed inset-0 z-50 lg:hidden transition-opacity",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <div
          className={cx(
            "absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-200">
            <span className="display text-xl tracking-[0.25em]">AURUM</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col p-5 gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className={cx(
                  "py-3 text-base tracking-[0.15em] uppercase border-b border-neutral-100",
                  n.accent && "text-sale",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="p-5 mt-auto">
            <Link
              to={user ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-3 text-sm"
            >
              <User size={16} /> {user ? user.name : "Sign in / Register"}
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-3 text-sm"
            >
              <Heart size={16} /> Wishlist ({ids.length})
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
