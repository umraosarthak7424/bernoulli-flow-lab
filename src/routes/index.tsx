import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-venturi.jpg";
import { meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => meta("Bernoulli's Theorem — Interactive Physics", "Explore Bernoulli's theorem from real-world puzzles to a rigorous derivation and a live Venturi tube simulator."),
  component: Index,
});

const STAGES = [
  { to: "/reality", n: "01", t: "Reality", d: "Why do sheets of paper rise when you blow over them?" },
  { to: "/model", n: "02", t: "Idealization", d: "Ideal fluid assumptions and the continuity equation." },
  { to: "/venturi", n: "03", t: "Venturi Lab", d: "Change the throat and watch pressure drop live." },
  { to: "/derivation", n: "04", t: "Derivation", d: "Work–energy theorem → Bernoulli's equation, plus video." },
  { to: "/applications", n: "05", t: "Applications", d: "Wings, atomizers and venturimeters." },
] as const;

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Water flowing through a glass Venturi tube" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 md:pt-48 animate-rise">
          <p className="eq text-xs uppercase tracking-[0.3em] text-accent">Fluid Dynamics · Energy Conservation</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
            Why does fast fluid have <span className="text-gradient">lower pressure?</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A five-stage journey from everyday observation to Bernoulli's equation — with an interactive Venturi lab you can control.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/reality" className="rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground shadow-glow transition hover:opacity-90">Start the journey</Link>
            <Link to="/venturi" className="rounded-lg border border-border bg-card/60 px-5 py-3 font-medium backdrop-blur transition hover:border-primary">Open Venturi Lab</Link>
          </div>
          <div className="eq mt-12 inline-block rounded-xl border border-border bg-card/70 px-6 py-4 text-lg backdrop-blur md:text-2xl">
            P + ½ρv² + ρgh = <span className="text-accent">constant</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <h2 className="text-3xl font-semibold md:text-4xl">Five stages. One powerful idea.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STAGES.map((s) => (
            <Link key={s.to} to={s.to} className="group rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-glow">
              <span className="eq text-sm text-accent">{s.n}</span>
              <h3 className="mt-2 text-xl font-semibold group-hover:text-primary">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
