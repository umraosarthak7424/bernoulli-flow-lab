# Bernoulli Flow Lab — Gamified Redesign Plan

## Branch safety (do this first)
- I can't switch Git branches from here. So before Stage 1, you create a **Draft** (a separate copy of the project) and approve it. All work happens there. `main`, the published site and `backup-before-redesign-2026-11-06` stay untouched.
- Nothing gets merged, published or pushed to `main` until you review and approve the result.
- The Quest game files (`src/routes/game.tsx`, `src/components/game/*`, `src/lib/game/engine|physics|pipes|questions.ts`) stay as they are. Saved progress keys stay exactly the same.

## Stages (each one is small and you can review it)

### Stage 1 — Shared look + navigation (sections 1, 8)
Files: `src/components/SiteLayout.tsx`, `src/styles.css`
- Nav links: smooth lift, small scale-up and glow on hover, focus and touch (`:active`). The current page gets a bright pill. Same pattern for the mobile menu, with large tap targets.
- New shared styles: `.btn-game`, `.card-game` (hover lift), `.pop-tip` (popup), `.range-game` (slider), `.eq-hero` (equation highlight), and a subtle science-grid background.
- `prefers-reduced-motion` turns off movement and keeps colour changes only.
- The nav stays the same 7 items. No Quiz link.
- Test: click through every page in desktop and mobile browser checks, keyboard tab focus, and the existing routing tests.

### Stage 2 — Home simplification (section 2)
File: `src/routes/index.tsx`
- Remove the "Open Venturi Lab" button and the "Five stages" section. Keep "Start the journey" as the main button (bigger, with glow). Add a small "5-stage journey" progress line in the hero so the page doesn't feel empty.
- Test: the home page loads at `/` and under `/bernoulli-flow-lab/`, and "Start" goes to the Reality page.

### Stage 3 — Reality: falling tap water (section 3)
File: `src/routes/reality.tsx` (a new small SVG component inside the same file)
- A drawn faucet and a continuous stream whose width follows real physics: v(y)=√(v₀²+2gy), so width ∝ √(A) ∝ (v₀/v)^½. Animated shimmer, plus droplets that speed up as they fall. Short labelled callouts for v and A.
- Text explains Q = A·v for steady incompressible flow.
- Test: a unit test that the width shrinks steadily as the water falls, plus a screenshot.

### Stage 4 — Ideal Model popups (section 4)
File: `src/routes/model.tsx`
- Each assumption card opens an animated popup on hover or focus, and on tap for touchscreens. Esc closes it, and it uses `aria-expanded` for accessibility. Each popup has a simple meaning plus an everyday example. One style everywhere. No new packages (built by hand, or using the existing shadcn Popover if it's already installed).
- Test: browser checks with hover, tap and keyboard.

### Stage 5 — Venturi Lab redesign (section 5)
File: `src/routes/venturi.tsx` (the physics in `src/lib/venturi.ts` stays the same and keeps its tests)
- A larger tube with a clear inlet, throat and outlet (the outlet is the same size as the inlet). Particles move faster through the throat, with speed scaled to v₂/v₁. A pressure colour band runs along the tube. Animated manometer tubes show the height difference Δh and the ΔP label. If the throat pressure would be negative, a "cavitation" warning appears (this already exists).
- A grouped control panel with nicer sliders, value chips, a **Reset** button and a "What's happening" explanation that updates live.
- Test: the existing Venturi tests, a new reset/default test, and browser checks at the lowest and highest settings (no clipping, no NaN).

### Stage 6 — Step-by-step derivation (section 6)
File: `src/routes/derivation.tsx`
- Remove the YouTube video section. Keep the diagram and the reading list.
- Show the intro, then a **Reveal the Derivation** button. Steps 1–6 appear one at a time with **Next Step** and a progress bar ("Step 2 of 6"). Earlier steps stay visible. After Step 6, the final equation appears in large text with a small "Discovery unlocked" badge. There is also a "Start over" button. The step text stays the same as now, with a short "why" line added to each step.
- Test: a unit test for the reveal state, and browser checks clicking through all 6 steps.

### Stage 7 — Sound across the whole site (section 7)
Files: reuse `src/lib/game/audio.ts` (add gentle `soft-click`, `reveal`, `tick` sounds). New `src/components/SoundToggle.tsx` in the header. It plugs into `src/routes/__root.tsx`.
- The sound engine is shared. Settings are saved under the **same** key the Quest page already uses, so one switch controls everything. Nothing plays until the student clicks or taps something. Slider sounds are limited so they don't repeat too fast. Music stays off until the student turns it on, and stops when the tab is hidden.
- Risk: the Quest page sets its own sound settings. I'll only wire it to the shared state. Its game logic stays unchanged. The game music turns off when you leave the page (this already works).
- Test: browser checks that muting silences everything and the setting is remembered after a reload. The existing game tests still pass.

### Stage 8 — Final check
- Run all tests and the GitHub Pages build. Check every route on desktop and mobile in the browser: console errors, horizontal overflow, reduced motion. Report changed files and results honestly. No publishing.

## Risks
- Quest progress: the save keys stay the same and game logic stays unchanged.
- Venturi accuracy: the physics module and its tests stay as they are. Only the drawing changes.
- Sound: browsers block autoplay, so sound starts after the first tap. Some phones in silent mode mute Web Audio.
- GitHub Pages: no new pages are added. Links to files keep using the existing base-path helper.

## Assets / packages
- None needed. All artwork is SVG/CSS and all sound is generated in the browser (original, free). No paid services.

## Technical notes
- Lift effect: `transition-[transform,box-shadow] hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-glow active:scale-95`, all inside `motion-safe:`.
- `/quiz` stays a page you can reach but stays out of the nav (unchanged).
