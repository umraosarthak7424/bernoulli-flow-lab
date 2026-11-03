// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GITHUB_PAGES=true → static export under /bernoulli-flow-lab/ (every route prerendered to HTML).
// Unset → normal Lovable build/preview, unchanged.
const ghPages = process.env.GITHUB_PAGES === "true";
const BASE = "/bernoulli-flow-lab/";
const ROUTES = ["/", "/reality", "/model", "/venturi", "/derivation", "/applications", "/quiz"];

export default defineConfig({
  tanstackStart: ghPages
    ? {
        server: { entry: "server" },
        router: { basepath: BASE },
        pages: ROUTES.map((p) => ({ path: (BASE + p.slice(1)).replace(/\/$/, "") || "/" })),
        prerender: { enabled: true, autoStaticPathsDiscovery: false },
        spa: { enabled: true, prerender: { outputPath: "/404.html" } },
      }
    : { server: { entry: "server" } },
  ...(ghPages ? { nitro: false as const } : {}),
  vite: ghPages ? { base: BASE } : {},
});
