import { createFileRoute } from "@tanstack/react-router";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/reality")({
  head: () => meta("Start with Reality — Bernoulli's Theorem", "Two everyday puzzles that reveal how fast-moving air has lower pressure."),
  component: Reality,
});

function Reality() {
  return (
    <>
      <PageHero kicker="Stage 01 · Reality" title="Start with reality.">
        Physics begins with observation. Before writing any equation, look at what moving air and water actually do.
      </PageHero>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        <Card>
          <svg viewBox="0 0 300 160" className="w-full">
            <path d="M40 40 Q150 60 260 40" fill="none" stroke="var(--primary)" strokeWidth="2" className="animate-flow" />
            <path d="M40 120 Q150 100 260 120" fill="none" stroke="var(--primary)" strokeWidth="2" className="animate-flow" />
            <path d="M60 50 Q150 80 240 50" className="fill-none stroke-accent" strokeWidth="5" />
            <path d="M60 110 Q150 80 240 110" className="fill-none stroke-accent" strokeWidth="5" />
            <text x="150" y="85" textAnchor="middle" fill="var(--foreground)" fontSize="12">fast air → low P</text>
          </svg>
          <h3 className="mt-4 text-2xl font-semibold">Two sheets of paper</h3>
          <p className="mt-2 text-muted-foreground">Blow between two hanging sheets and they move <em>together</em>, not apart. The fast air between them is at lower pressure than the still air outside, so the outside air pushes them inward.</p>
        </Card>
        <Card>
          <svg viewBox="0 0 300 160" className="w-full">
            <rect x="30" y="20" width="60" height="20" rx="4" fill="var(--muted-foreground)" />
            <path d="M50 40 Q55 100 52 150" fill="none" stroke="var(--primary)" strokeWidth="22" strokeLinecap="round" opacity=".35" />
            <path d="M50 40 Q55 100 52 150" fill="none" stroke="var(--primary)" strokeWidth="10" strokeLinecap="round" />
            <path d="M170 60 L270 60 L270 100 L170 100 Z" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <text x="220" y="84" textAnchor="middle" fill="var(--foreground)" fontSize="11">A·v = constant</text>
          </svg>
          <h3 className="mt-4 text-2xl font-semibold">A narrowing stream of water</h3>
          <p className="mt-2 text-muted-foreground">Water falling from a tap speeds up under gravity, and the stream becomes thinner. Same volume per second, higher speed ⇒ smaller area — a hint of the continuity equation.</p>
        </Card>
      </section>
      <section className="mx-auto mt-10 max-w-6xl px-5">
        <Card className="border-primary/40">
          <h3 className="text-xl font-semibold text-primary">The question</h3>
          <p className="mt-2 text-muted-foreground">If no energy is lost, how must pressure, speed and height trade off against each other along a flowing fluid? Answering that is Bernoulli's theorem.</p>
        </Card>
      </section>
      <NextLink to="/model" label="Build an ideal model" />
    </>
  );
}
