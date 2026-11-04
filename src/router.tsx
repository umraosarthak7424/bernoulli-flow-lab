import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function stripIndexHtml(url: URL) {
  if (url.pathname.endsWith("/index.html")) url.pathname = url.pathname.slice(0, -"index.html".length);
  return url;
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    trailingSlash: "preserve",
    // Static hosts (GitHub Pages) also serve dir/index.html; treat it as the directory URL.
    rewrite: { input: ({ url }) => stripIndexHtml(url) },
    defaultPreloadStaleTime: 0,
  });

  return router;
};
