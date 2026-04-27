import { Link } from "react-router-dom";
import { useState } from "react";

const Icon = ({ d, label }: { d: string; label: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    aria-label={label}
    role="img"
  >
    <path d={d} />
  </svg>
);

const SOCIALS = [
  {
    label: "Instagram",
    d: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.4.4.6.2 1.1.5 1.6 1s.8 1 1 1.6c.2.5.4 1.2.4 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1.1-1 1.6s-1 .8-1.6 1c-.5.2-1.2.4-2.4.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1.1-.5-1.6-1s-.8-1-1-1.6c-.2-.5-.4-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.4.2-.6.5-1.1 1-1.6s1-.8 1.6-1c.5-.2 1.2-.4 2.4-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-2 .3-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.1.4-.3 1-.3 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1 .2 1.6.3 2 .2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.1 1 .3 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 2-.3.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.1-.4.3-1 .3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.3-2-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.1-1-.3-2-.3C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 1.8a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2zm5.1-2.1a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3z",
  },
  {
    label: "Twitter / X",
    d: "M18.244 2H21.5l-7.59 8.66L23 22h-7.03l-5.49-7.18L4.2 22H1l8.13-9.28L1 2h7.18l4.97 6.57L18.244 2zm-1.232 18h1.84L7.07 4H5.13l11.882 16z",
  },
  {
    label: "YouTube",
    d: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z",
  },
  {
    label: "Facebook",
    d: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.84c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06z",
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-24 border-t border-neutral-200 bg-bone">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-2 md:pr-12">
            <Link to="/" className="display text-3xl tracking-[0.3em] block mb-4">
              AURUM
            </Link>
            <p className="text-sm text-clay leading-relaxed mb-6 max-w-md">
              Modern essentials for everyday wear. Designed for movement, made to last.
              Built for the next generation of streetwear and casual fashion.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSubscribed(true);
              }}
              className="flex max-w-sm border-b border-ink"
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe for 10% off"
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-clay"
                type="email"
              />
              <button type="submit" className="text-xs tracking-[0.2em] uppercase px-4 hover:opacity-60">
                {subscribed ? "Thanks!" : "Subscribe"}
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase mb-4 font-sans font-medium">Shop</h4>
            <ul className="space-y-3 text-sm text-clay">
              <li><Link to="/men" className="hover:text-ink transition-colors">Men</Link></li>
              <li><Link to="/women" className="hover:text-ink transition-colors">Women</Link></li>
              <li><Link to="/new" className="hover:text-ink transition-colors">New Arrivals</Link></li>
              <li><Link to="/best" className="hover:text-ink transition-colors">Best Sellers</Link></li>
              <li><Link to="/sale" className="hover:text-ink transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase mb-4 font-sans font-medium">Help</h4>
            <ul className="space-y-3 text-sm text-clay">
              <li><Link to="/policies/shipping" className="hover:text-ink transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/policies/sizing" className="hover:text-ink transition-colors">Size Guide</Link></li>
              <li><Link to="/policies/contact" className="hover:text-ink transition-colors">Contact Us</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" className="hover:text-ink transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-clay">
          <div>© {new Date().getFullYear()} AURUM. All rights reserved.</div>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="hover:text-ink transition-colors"
              >
                <Icon d={s.d} label={s.label} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span>USD $</span>
            <span>Shipping worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
