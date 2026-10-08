# Dither redesign — build & preview notes

Static-export Next.js 14 portfolio (pnpm workspace, Next 14.2.13 / React 18.3.1).
Design system, dither engine and verification steps for the dithered redesign.

## 1. Run it

A fresh checkout needs `node_modules/` and one `package.json` fix (an
unpublished dev dependency, see below). No `.env*` files are required — the
Supabase publishable key is committed in `src/integrations/supabase/client.ts`.

### Fix the unpublished dev dependency (if not already applied)

`@dyad-sh/nextjs-webpack-component-tagger@^0.0.1` was never published to npm,
so a bare install fails. In `package.json` the devDependency is pinned to
`"^0.8.0"`.

### Install and run

```bash
npx pnpm install --no-frozen-lockfile   # --frozen-lockfile fails on a stale lockfile
npx next dev -H 0.0.0.0 -p 3000
```

`NEXT_PUBLIC_BASE_PATH` must stay **unset** for local work (the site is served
at `/`); it is only set for the production GitHub Pages export under `/portfolio`.

### Production build

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npx next build   # writes ./out
npx serve out                                     # or any static server
```

## 2. The design system

Everything lives in CSS variables in `src/app/globals.css`:

| Token group | Purpose |
| --- | --- |
| `--background`, `--foreground`, `--card`, `--card-2`, `--muted`, `--border` | dark (`.dark`) and light (“paper”) bases |
| `--accent-1…5` | text-safe accents for the **current** theme (all ≥ 4.5:1, most ≥ 6:1) |
| `--vivid-1…5` | always-saturated fills for dither dots and chips — always paired with `--on-vivid` ink (≥ 6.9:1) |
| `--dither-base`, `--dither-ink`, `--dither-cell` | dither grid |
| `--print-ink`, `--print-paper` | fixed riso pair (never themed): the hero field and the hero type plate |
| `--hairline`, `--hairline-strong`, `--nav-h` | print chrome: 1 px rules instead of web borders |
| `--section-y` | one vertical rhythm for every band of the page |

Tailwind exposes them as `bg-background`, `text-muted-foreground`, `text-ink-3`,
`bg-vivid-2`, … (`tailwind.config.ts`).

**Type** — two self-hosted faces in `src/fonts/` (SIL OFL, licences alongside):
Archivo Black (`--font-display`, all headings + the name) and Inter
(`--font-body`). Inter is subset to `U+0020–00FF` plus typographic punctuation
and clamped to the 400–650 weight band, so the file is 21 kB rather than 48 kB.
No third-party font requests at runtime.

## 3. The dither engine — `src/lib/dither.ts`

One dependency-free module backs every effect:

- `BAYER_8` / `bayerThreshold(x, y)` — the 8×8 ordered threshold matrix.
- `ditherValue(value, threshold, palette)` — maps 0…1 to a dot colour; the
  fractional part decides which of the two neighbouring entries is placed.
- `ditherImageRamp(imageData, palette)` — ordered-dithers a photograph through
  a luminance ramp (project card images).
- `ditherGradient()` / `createField()` / `sampleField()` — static gradients and
  the animated field used by the hero.

Consumers:

| Component | What it does | Cost control |
| --- | --- | --- |
| `dither-field.tsx` | hero: live Bayer dither of a three-wave colour field, printed in fixed ink → violet → magenta → cyan → paper | 1 dot / 7 CSS px (≤ 200 columns), `image-rendering: pixelated`, 30 fps cap, `IntersectionObserver` pause off-screen, `visibilitychange` pause in a background tab |
| `dither-image.tsx` | project images: dithered by default, full colour on hover / keyboard focus, plus a “Colour / Dither” button on touch (`hover: none`) | 3 px dots on a processing canvas ≤ 400 px on the long edge, auto-levelled from the photograph (2 % / 98.5 % percentiles) then gamma 0.85, computed once when scrolled into view; the two layers are plain CSS opacity cross-fades |
| `dither-image.tsx` — auto art direction | the project list reuses source files; a card whose cropped frame is already on screen (`frameFingerprint`, 8×8 mean-luma hash) falls back to the next tighter field, so no two cards show the same photograph | one extra fingerprint per candidate crop, only while rendering |
| `dither-cursor.tsx` | desktop pointer trail: coarse Bayer-dithered dot spray, cyan → magenta | desktop + fine pointer only, RAM-capped wake-up loop, absent under reduced motion |
| `theme-toggle.tsx` | dark/light switch | `next-themes`, `attribute="class"`, persisted under `juwain-theme` |

**Reduced motion** — `prefers-reduced-motion: reduce` draws the hero field once
with no loop, hides the cursor trail entirely, keeps every dithered image static
and neutralises reveal transitions (content is never left hidden).

## 4. Verification

Playwright + puppeteer scripts used for the final pass (Chrome 153 headless):

- Screenshots at **1440 / 820 / 390 px**, every section, **both themes**,
  each checked for horizontal overflow (`scrollWidth <= clientWidth`).
- Functional checks: theme toggle persistence, nav section highlighting, reveal
  animations, mobile menu, skip link + focus ring, contact form (validation,
  placeholder guard, real POST shape, success/error states), reduced-motion
  stillness.
- Functional audit: **34/34 checks** on the production export — theme
  persistence, single archive link, positional project numbering, live footer
  year, meta/OG tags, alt text, nav highlighting, reduced-motion stillness and
  the contact form (placeholder guard, POST shape, success/error copy).
- Lighthouse against the production export served with gzip + long-lived
  `/_next/static` caching (what GitHub Pages does), run with
  `--preset=desktop` for the desktop form factor:
  **performance 100 mobile / 100 desktop, accessibility 100 / 100,
  best practices 96, SEO 100**; LCP 1.9 s mobile / 0.5 s desktop, CLS 0.
  Best practices is capped by a single `errors-in-console` finding from the
  Supabase client, which is unreachable from this network — not a site bug.

`e2e-tests/portfolio.spec.ts` in this repo mirrors the functional checks:

```bash
DYAD_TEST_BASE_URL=http://localhost:3000 npx playwright test -c playwright-dyad.config.ts
```

## 5. Before going live

1. **Contact form** — replace `contactFormId` in `src/data/site-config.ts`
   (currently the placeholder `YOUR_FORMSPREE_ID`). The form detects the
   placeholder, refuses to POST and points visitors at the email address, so
   nothing is silently lost. Set `contactFormProvider` to `"web3forms"` to use
   a Web3Forms access key instead.
2. **Open Graph** — `public/og.png` (1200×630) matches the live design; swap it
   if the wording changes.
