import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/reality", label: "Reality" },
  { to: "/model", label: "Ideal Model" },
  { to: "/venturi", label: "Venturi Lab" },
  { to: "/derivation", label: "Derivation" },
  { to: "/applications", label: "Applications" },
  { to: "/quiz", label: "Quiz" },
  { to: "/game", label: "Quest" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="font-display text-lg font-semibold">
          <span className="text-gradient">P + ½ρv² + ρgh</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          className="rounded-md border border-border px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-border px-5 py-2 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: true }}
              className="py-2 text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row md:justify-between">
        <p>Made by SARTHAK UMRAO (24SD12007) and SOHIT (24SD12013))</p>
        <p className="eq">P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂</p>
      </div>
    </footer>
  );
}

export function PageHero({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 animate-rise">
      <p className="eq text-xs uppercase tracking-[0.3em] text-accent">{kicker}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold md:text-6xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-lg text-muted-foreground">{children}</div>}
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-6 ${className}`}>{children}</div>;
}

export function NextLink({ to, label }: { to: (typeof NAV)[number]["to"]; label: string }) {
  return (
    <div className="mx-auto mt-16 max-w-6xl px-5">
      <Link to={to} className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 transition hover:shadow-glow">
        <span className="text-muted-foreground">Next stage</span>
        <span className="font-display text-2xl text-primary">{label} →</span>
      </Link>
    </div>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
