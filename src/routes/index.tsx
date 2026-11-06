import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-venturi.jpg";
import { meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => meta("Bernoulli's Theorem — Interactive Physics", "Explore Bernoulli's theorem through everyday observations, a live Venturi lab, a scientific derivation and an interactive physics quest."),
  component: Index,
});

function Index() {
  return (
    <section className="relative isolate min-h-[580px] overflow-hidden md:min-h-[660px]">
      <img src={hero} alt="Water flowing through a glass Venturi tube" width={1600} height={912}
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 -z-10 bg-hero-fade" />
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-28 md:pt-44 animate-rise">
        <p className="eq text-xs uppercase tracking-[0.3em] text-accent">Fluid Dynamics · Energy Conservation</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
          Why does fast fluid have <span className="text-gradient">lower pressure?</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Explore the physics behind moving fluids, discover Bernoulli's equation and experiment with a live Venturi lab.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/reality" className="primary-action rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-all duration-200">
            Start the Journey <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="eq mt-12 inline-block rounded-2xl border border-border bg-card/75 px-6 py-4 text-lg shadow-glow backdrop-blur md:text-2xl">
          P + ½ρv² + ρgh = <span className="text-accent">constant</span>
        </div>
      </div>
    </section>
  );
}
