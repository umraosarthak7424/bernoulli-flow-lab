import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { stripIndexHtml } from "@/router";

describe("GitHub Pages paths", () => {
  it("/bernoulli-flow-lab/index.html is treated as the home page", () => {
    expect(stripIndexHtml(new URL("https://x.io/bernoulli-flow-lab/index.html")).pathname).toBe("/bernoulli-flow-lab/");
  });
  it("home matches under the Pages basepath", () => {
    const router = createRouter({ routeTree, basepath: "/bernoulli-flow-lab/", context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/").at(-1)?.routeId).toBe("/");
  });
});
