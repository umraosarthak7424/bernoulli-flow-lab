import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHero, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/quiz")({
  head: () => meta("Bernoulli Five-Question Challenge", "Test your understanding of Bernoulli's theorem and continuity."),
  component: Quiz,
});

const Q: { q: string; o: string[]; a: number; why: string }[] = [
  { q: "Bernoulli's equation is based on which principle?", o: ["Conservation of momentum", "Conservation of energy", "Conservation of charge", "Newton's law of gravitation"], a: 1, why: "It is the work–energy theorem applied to an ideal fluid." },
  { q: "For steady incompressible flow, which equation expresses continuity?", o: ["P + ½ρv² = constant", "A₁v₁ = A₂v₂", "F = ma", "PV = nRT"], a: 1, why: "Volume flow rate Q = Av is constant." },
  { q: "In a horizontal Venturi tube, what generally happens at the narrow throat?", o: ["Speed decreases, pressure increases", "Speed increases, pressure decreases", "Both increase", "Both stay the same"], a: 1, why: "Continuity raises v; Bernoulli then requires P to drop." },
  { q: "Which is an assumption used in the simple Bernoulli model?", o: ["Highly viscous flow", "Turbulent flow", "Non-viscous, incompressible flow", "Compressible gas at high speed"], a: 2, why: "Ideal fluid: no friction, constant density, steady flow." },
  { q: "What does the term ρgh represent per unit volume?", o: ["Kinetic energy", "Pressure energy", "Gravitational potential energy", "Thermal energy"], a: 2, why: "mgh ÷ V = ρgh." },
];

function Quiz() {
  const [ans, setAns] = useState<(number | null)[]>(Q.map(() => null));
  const score = ans.filter((a, i) => a === Q[i]?.a).length;
  const done = ans.every((a) => a !== null);
  return (
    <>
      <PageHero kicker="Challenge" title="Five-question challenge." />
      <section className="mx-auto max-w-3xl space-y-5 px-5">
        {Q.map((x, i) => (
          <Card key={i}>
            <h3 className="text-lg font-semibold">{i + 1}. {x.q}</h3>
            <div className="mt-4 grid gap-2">
              {x.o.map((o, j) => {
                const picked = ans[i] === j;
                const show = ans[i] !== null;
                const cls = show && j === x.a ? "border-success text-success" : picked ? "border-destructive text-destructive" : "border-border hover:border-primary";
                return (
                  <button key={j} disabled={show} onClick={() => setAns(ans.map((v, k) => (k === i ? j : v)))} className={`rounded-lg border px-4 py-2 text-left transition ${cls}`}>{o}</button>
                );
              })}
            </div>
            {ans[i] !== null && <p className="mt-3 text-sm text-muted-foreground">{x.why}</p>}
          </Card>
        ))}
        {done && (
          <Card className="border-primary text-center shadow-glow">
            <p className="eq text-4xl text-gradient">{score} / 5</p>
            <h2 className="mt-3 text-2xl font-semibold">Project conclusion</h2>
            <p className="mt-2 text-muted-foreground">Starting from simple observations, we built an ideal model, used continuity, and applied energy conservation to obtain P + ½ρv² + ρgh = constant — then saw it at work in wings, sprays and flow meters.</p>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => setAns(Q.map(() => null))} className="rounded-lg border border-border px-4 py-2">Retry</button>
              <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Home</Link>
            </div>
          </Card>
        )}
      </section>
    </>
  );
}
