import { createFileRoute } from "@tanstack/react-router";
import wing from "@/assets/wing.jpg";
import atomizer from "@/assets/atomizer.jpg";
import meter from "@/assets/venturimeter.jpg";
import { NextLink, PageHero, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/applications")({
  head: () => meta("Bernoulli in the Real World — Applications", "How aircraft wings, atomizers and venturimeters use Bernoulli's principle."),
  component: Apps,
});

const APPS = [
  { img: wing, t: "Aircraft wings", eq: "L ≈ ½ρ(v_top² − v_bottom²)·A", d: "Air over the curved upper surface moves faster than below the wing, so pressure above is lower. The pressure difference across the wing area contributes to lift. (Full lift also involves the wing turning the airflow downward — Newton's third law; the 'equal transit time' explanation is a myth.)" },
  { img: atomizer, t: "Atomizers & spray bottles", eq: "P_jet < P_atm", d: "A fast air jet across the top of a narrow tube lowers the pressure there. Atmospheric pressure on the liquid surface pushes liquid up the tube, where the jet breaks it into fine droplets." },
  { img: meter, t: "Venturimeters", eq: "Q = A₁A₂ √(2ΔP / ρ(A₁² − A₂²))", d: "Measuring the pressure drop between the inlet and throat with a manometer lets engineers calculate the flow rate in a pipe without any moving parts." },
];

function Apps() {
  return (
    <>
      <PageHero kicker="Stage 05 · Applications" title="Bernoulli in the real world." />
      <section className="mx-auto max-w-6xl space-y-16 px-5">
        {APPS.map((a, i) => (
          <article key={a.t} className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? "md:[&>img]:order-2" : ""}`}>
            <img src={a.img} alt={a.t} width={1200} height={800} loading="lazy" className="w-full rounded-xl border border-border object-cover transition duration-500 hover:scale-[1.02]" />
            <div>
              <span className="eq text-sm text-accent">0{i + 1}</span>
              <h2 className="mt-2 text-3xl font-semibold">{a.t}</h2>
              <p className="mt-4 text-muted-foreground">{a.d}</p>
              <p className="eq mt-4 inline-block rounded-lg bg-secondary px-4 py-2 text-primary">{a.eq}</p>
            </div>
          </article>
        ))}
      </section>
      <NextLink to="/game" label="Start the Quest" />
    </>
  );
}
