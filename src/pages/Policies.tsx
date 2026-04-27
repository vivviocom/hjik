import { useParams, Navigate } from "react-router-dom";

const POLICIES: Record<string, { title: string; subtitle?: string; body: React.ReactNode }> = {
  shipping: {
    title: "Shipping & Returns",
    subtitle: "How we get your order to you, and what to do if it's not right.",
    body: (
      <>
        <h3 className="display text-2xl mt-8 mb-3">Shipping</h3>
        <p>Free standard shipping on orders over $80. Standard delivery is 3–7 business days. Express shipping available at checkout for $18 (1–2 business days). We ship worldwide from our warehouse in the EU.</p>
        <h3 className="display text-2xl mt-8 mb-3">Returns</h3>
        <p>We accept returns within 30 days of delivery for a full refund. Items must be unworn, unwashed, and in their original condition with tags attached. Sale items can be returned for store credit.</p>
        <h3 className="display text-2xl mt-8 mb-3">Exchanges</h3>
        <p>Need a different size? Contact us within 7 days of delivery and we'll cover return shipping for the exchange.</p>
      </>
    ),
  },
  sizing: {
    title: "Size Guide",
    subtitle: "Find your fit.",
    body: (
      <>
        <p>Our pieces are designed with a relaxed, considered fit. If you're between sizes, we generally recommend sizing down for a closer cut and up for a more oversized look.</p>
        <h3 className="display text-2xl mt-8 mb-3">Tops & Outerwear</h3>
        <p className="font-mono text-sm">XS — chest 34" · S — 36" · M — 38" · L — 40" · XL — 42"</p>
        <h3 className="display text-2xl mt-8 mb-3">Bottoms (waist)</h3>
        <p className="font-mono text-sm">28 · 30 · 32 · 34 · 36</p>
        <h3 className="display text-2xl mt-8 mb-3">Footwear (US)</h3>
        <p className="font-mono text-sm">6 · 7 · 8 · 9 · 10 · 11 · 12</p>
      </>
    ),
  },
  contact: {
    title: "Contact Us",
    subtitle: "We're here to help.",
    body: (
      <>
        <p>Reach our team Monday through Friday, 9am–5pm CET. We aim to respond within 24 hours.</p>
        <ul className="mt-6 space-y-3">
          <li><span className="text-[11px] tracking-[0.25em] uppercase text-clay">Email</span><br />hello@aurum.studio</li>
          <li><span className="text-[11px] tracking-[0.25em] uppercase text-clay">Instagram</span><br />@aurum.studio</li>
          <li><span className="text-[11px] tracking-[0.25em] uppercase text-clay">Atelier</span><br />Rua da Boavista 92, 4050-107 Porto, Portugal</li>
        </ul>
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p>This is a demo store. AURUM does not collect, store, or share any real personal data. Cart, account, and order information shown in this demo are stored only in your browser's local storage and never transmitted.</p>
        <p className="mt-4">In a production deployment, AURUM would only collect the information needed to fulfill your order and improve your experience. We would never sell your data to third parties.</p>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    body: (
      <>
        <p>This site is a demonstration. By browsing, you agree it's for evaluation purposes only and that no real transactions are processed. All product photography is from Unsplash and is used for demo purposes.</p>
      </>
    ),
  },
};

export default function Policies() {
  const { slug } = useParams();
  const page = slug ? POLICIES[slug] : null;
  if (!page) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-12 lg:py-20">
      {page.subtitle && (
        <p className="text-[11px] tracking-[0.3em] uppercase text-clay mb-3">{page.subtitle}</p>
      )}
      <h1 className="display text-4xl lg:text-5xl mb-8">{page.title}</h1>
      <div className="text-clay leading-relaxed space-y-4 text-[15px]">{page.body}</div>
    </div>
  );
}
