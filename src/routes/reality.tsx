import { createFileRoute } from "@tanstack/react-router";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";
import { fallingStreamDiameter } from "@/lib/water-stream";

export const Route = createFileRoute("/reality")({
  head: () => meta("Start with Reality — Bernoulli's Theorem", "Observe how moving air changes pressure and why a falling water stream becomes thinner."),
  component: Reality,
});

function FallingWater() {
  const center = 214;
  const topY = 58;
  const drops = [0, 0.45, 0.9, 1.35, 1.8];
  const widths = drops.map((drop) => fallingStreamDiameter(25, 1.4, drop));
  const left = drops.map((drop, i) => `${center - widths[i]! / 2},${topY + drop * 88}`);
  const right = [...drops].reverse().map((drop, reverseIndex) => {
    const i = drops.length - 1 - reverseIndex;
    return `${center + widths[i]! / 2},${topY + drop * 88}`;
  });
  const streamPath = `M ${left.join(" L ")} L ${right.join(" L ")} Z`;
  return (
    <svg viewBox="0 0 460 250" className="w-full" role="img" aria-label="Water falls from a tap, accelerates under gravity and narrows as its speed increases">
      <defs>
        <linearGradient id="waterGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#1597d5" />
          <stop offset=".48" stopColor="#8beaff" />
          <stop offset="1" stopColor="#1385cf" />
        </linearGradient>
        <clipPath id="waterClip"><path d={streamPath} /></clipPath>
      </defs>
      {/* Faucet body and spout */}
      <path d="M100 42 V25 Q100 12 114 12 H180 Q194 12 194 26 V43 H166 V34 H124 V58 H100 Z"
        fill="#9caec1" stroke="#22334a" strokeWidth="5" strokeLinejoin="round" />
      <path d="M166 42 H229 Q243 42 243 56 V68 H218 V61 H188" fill="none" stroke="#71849b" strokeWidth="17" strokeLinecap="round" />
      <path d="M166 42 H229 Q243 42 243 56 V68 H218 V61 H188" fill="none" stroke="#dce9f4" strokeWidth="7" strokeLinecap="round" />
      <path d="M205 70 H223" stroke="#22334a" strokeWidth="5" strokeLinecap="round" />
      <path d={streamPath} fill="url(#waterGradient)" opacity=".95" />
      <g clipPath="url(#waterClip)" className="water-shimmer">
        <path d="M210 55 V235" stroke="#e9fbff" strokeWidth="5" strokeDasharray="12 12" opacity=".6" />
        <path d="M218 55 V235" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="5 12" opacity=".65" />
      </g>
      {[0,1,2].map((n) => <circle key={n} cx={225 + n * 5} cy={120 + n * 44} r={3.2 - n * .45} fill="#b8f4ff" className="water-drop" style={{ animationDelay: `${n * .45}s` }} />)}
      <path d="M275 89 H320 M275 89 V205 M275 205 H320" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="329" y="94" fill="var(--foreground)" fontSize="13" fontWeight="600">Higher speed</text>
      <text x="329" y="112" fill="var(--muted-foreground)" fontSize="11">v increases ↓</text>
      <text x="329" y="190" fill="var(--foreground)" fontSize="13" fontWeight="600">Smaller area</text>
      <text x="329" y="208" fill="var(--muted-foreground)" fontSize="11">A decreases ↓</text>
      <text x="214" y="244" textAnchor="middle" fill="var(--accent)" fontSize="12">Same flow rate: Q = A·v</text>
    </svg>
  );
}

function Reality() {
  return (
    <>
      <PageHero kicker="Stage 01 · Reality" title="Start with reality.">
        Physics begins with observation. Before writing any equation, look at what moving air and water actually do.
      </PageHero>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        <Card className="interactive-card">
          <svg viewBox="0 0 300 160" className="w-full" role="img" aria-label="Air moves faster between two sheets of paper and pressure there is lower">
            <path d="M40 40 Q150 60 260 40" fill="none" stroke="var(--primary)" strokeWidth="2" className="animate-flow" />
            <path d="M40 120 Q150 100 260 120" fill="none" stroke="var(--primary)" strokeWidth="2" className="animate-flow" />
            <path d="M60 50 Q150 80 240 50" className="fill-none stroke-accent" strokeWidth="5" />
            <path d="M60 110 Q150 80 240 110" className="fill-none stroke-accent" strokeWidth="5" />
            <text x="150" y="85" textAnchor="middle" fill="var(--foreground)" fontSize="12">fast air → low P</text>
          </svg>
          <h3 className="mt-4 text-2xl font-semibold">Two sheets of paper</h3>
          <p className="mt-2 text-muted-foreground">Blow between two hanging sheets and they move <em>together</em>, not apart. The fast air between them is at lower pressure than the still air outside, so the outside air pushes them inward.</p>
        </Card>
        <Card className="interactive-card">
          <div className="rounded-xl bg-secondary/50 p-3">
            <FallingWater />
          </div>
          <h3 className="mt-4 text-2xl font-semibold">A narrowing stream of water</h3>
          <p className="mt-2 text-muted-foreground">Water leaving a tap accelerates as it falls under gravity. Its speed rises, so its cross-sectional area must shrink to carry the same volume each second.</p>
          <p className="eq mt-4 inline-flex rounded-lg bg-secondary px-3 py-2 text-primary">Q = A·v = constant</p>
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
