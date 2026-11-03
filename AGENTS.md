<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Venturi physics lives in src/lib/venturi.ts (pure, tested); pages share header/footer/meta helpers from src/components/SiteLayout.tsx.
- GitHub Pages export: `bun run build:pages` (GITHUB_PAGES=true) prerenders every route to dist/client under base /bernoulli-flow-lab/ with nitro off; new routes must be added to ROUTES in vite.config.ts. Why: Pages hosts only static files from a repo subpath.
- Use `__APP_BASE__` (not hardcoded "/") for raw hrefs to public files; router uses trailingSlash "preserve" so prerendered dir/index.html URLs don't redirect-loop.
