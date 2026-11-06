import { createFileRoute } from "@tanstack/react-router";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";
import { fallingStreamDiameter } from "@/lib/water-stream";

export const Route = createFileRoute("/reality")({
  head: () => meta("Start with Reality — Bernoulli's Theorem", "Observe how moving air changes pressure and why a falling water stream becomes thinner."),
  component: Reality,
});

function FallingWater() {
  const center = 263;
  const topY = 150;
  const drops = [0, 0.45, 0.9, 1.35, 1.8];
  const widths = drops.map((drop) => fallingStreamDiameter(22, 1.4, drop));
  const left = drops.map((drop, i) => `${center - widths[i]! / 2},${topY + drop * 68}`);
  const right = [...drops].reverse().map((drop, reverseIndex) => {
    const i = drops.length - 1 - reverseIndex;
    return `${center + widths[i]! / 2},${topY + drop * 68}`;
  });
  const streamPath = `M ${left.join(" L ")} L ${right.join(" L ")} Z`;

  return (
    <svg viewBox="0 0 460 300" className="w-full" role="img" aria-label="A silver faucet releases a water jet that accelerates and becomes thinner as it falls">
      <defs>
        <linearGradient id="faucetChrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#647b94" />
          <stop offset=".18" stopColor="#f5fbff" />
          <stop offset=".38" stopColor="#8da5bc" />
          <stop offset=".57" stopColor="#f9fdff" />
          <stop offset=".78" stopColor="#718aa4" />
          <stop offset="1" stopColor="#dce8f1" />
        </linearGradient>
        <linearGradient id="faucetDark" x1="0" x2="1">
          <stop offset="0" stopColor="#526b84" />
          <stop offset=".5" stopColor="#d8e5ef" />
          <stop offset="1" stopColor="#607991" />
        </linearGradient>
        <linearGradient id="waterGradient" x1="0" x2="1">
          <stop offset="0" stopColor="#087fbd" />
          <stop offset=".45" stopColor="#9af0ff" />
          <stop offset="1" stopColor="#087fbd" />
        </linearGradient>
        <clipPath id="fallingWaterClip"><path d={streamPath} /></clipPath>
        <filter id="faucetShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity=".32" />
        </filter>
      </defs>

      {/* Wall connector and a recognisable chrome faucet body. */}
      <g filter="url(#faucetShadow)">
        <rect x="34" y="91" width="42" height="43" rx="8" fill="url(#faucetDark)" stroke="#263c53" strokeWidth="4" />
        <rect x="42" y="99" width="27" height="27" rx="4" fill="none" stroke="#e7f4ff" strokeOpacity=".72" strokeWidth="2" />
        <path d="M60 112 H132 C153 112 168 96 168 75 V64 C168 44 184 29 204 29 H226 C247 29 263 45 263 66 V126"
          fill="none" stroke="#263c53" strokeWidth="43" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 112 H132 C153 112 168 96 168 75 V64 C168 44 184 29 204 29 H226 C247 29 263 45 263 66 V126"
          fill="none" stroke="url(#faucetChrome)" strokeWidth="35" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 104 H130 C148 104 159 91 159 74 V64 C159 48 183 38 204 38 H226 C240 38 254 51 254 67 V122"
          fill="none" stroke="#ffffff" strokeOpacity=".52" strokeWidth="4" strokeLinecap="round" />
        {/* Control stem and cross handle. */}
        <rect x="207" y="8" width="25" height="27" rx="7" fill="url(#faucetChrome)" stroke="#263c53" strokeWidth="3" />
        <path d="M183 15 H257" stroke="#263c53" strokeWidth="15" strokeLinecap="round" />
        <path d="M183 13 H257" stroke="url(#faucetChrome)" strokeWidth="10" strokeLinecap="round" />
        <circle cx="183" cy="13" r="10" fill="url(#faucetDark)" stroke="#263c53" strokeWidth="2" />
        <circle cx="257" cy="13" r="10" fill="url(#faucetDark)" stroke="#263c53" strokeWidth="2" />
        {/* Nozzle rim and dark outlet. */}
        <rect x="245" y="121" width="36" height="25" rx="6" fill="url(#faucetChrome)" stroke="#263c53" strokeWidth="3" />
        <ellipse cx="263" cy="145" rx="14" ry="4.5" fill="#15283a" stroke="#e5f2fc" strokeWidth="2" />
      </g>

      {/* The jet starts broad and tapers as its speed increases under gravity. */}
      <path d={streamPath} fill="url(#waterGradient)" opacity=".96" />
      <g clipPath="url(#fallingWaterClip)" className="water-shimmer">
        <path d="M263 147 V292" stroke="#eaffff" strokeWidth="4" strokeDasharray="10 12" opacity=".72" />
        <path d="M269 147 V292" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 12" opacity=".72" />
        {[0,1,2].map((n) => (
          <circle key={n} cx={255 + n * 7} cy={166 + n * 38} r="2.5" fill="#ffffff" opacity=".85">
            <animate attributeName="cy" values={`${166+n*38};${208+n*38}`} dur="1.4s" begin={`${n*.42}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <path d="M300 158 H319 M319 158 V270 M300 270 H319" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="328" y="164" fill="var(--foreground)" fontSize="13" fontWeight="600">Speed rises</text>
      <text x="328" y="182" fill="var(--muted-foreground)" fontSize="11">v increases ↓</text>
      <text x="328" y="244" fill="var(--foreground)" fontSize="13" fontWeight="600">Jet narrows</text>
      <text x="328" y="262" fill="var(--muted-foreground)" fontSize="11">A decreases ↓</text>
      <text x="263" y="294" textAnchor="middle" fill="var(--accent)" fontSize="11">Q = A·v</text>
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
