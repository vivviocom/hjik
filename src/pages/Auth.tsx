import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(email, password);
    if (r.ok) navigate("/account");
    else setErr(r.message);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-24">
      <h1 className="display text-4xl text-center mb-2">Sign In</h1>
      <p className="text-center text-clay text-sm mb-10">Welcome back to AURUM.</p>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </Field>
        {err && <p className="text-sale text-sm">{err}</p>}
        <button
          type="submit"
          className="w-full bg-ink text-bone text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-clay transition-colors"
        >
          Sign In
        </button>
      </form>
      <p className="text-center text-sm text-clay mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-ink underline-offset-2 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    const r = register(name, email, password);
    if (r.ok) navigate("/account");
    else setErr(r.message);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-24">
      <h1 className="display text-4xl text-center mb-2">Create Account</h1>
      <p className="text-center text-clay text-sm mb-10">Join AURUM. Get 10% off your first order.</p>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Full name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </Field>
        <Field label="Password (min 6 chars)">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </Field>
        {err && <p className="text-sale text-sm">{err}</p>}
        <button
          type="submit"
          className="w-full bg-ink text-bone text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-clay transition-colors"
        >
          Create Account
        </button>
      </form>
      <p className="text-center text-sm text-clay mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-ink underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
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
