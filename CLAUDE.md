# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free storefront for the GURBET "Türkiye Drops" merch brand. No framework, no build step, no package manager, no backend. Plain HTML + CSS + a single vanilla-JS file. All app files live at the repository root (`index.html`, `app.js`, `styles.css`, `assets/`, etc.) so the site deploys from the repo root with no extra config (Vercel Root Directory = repo root).

## Running

```bash
python3 -m http.server 8080   # run from the repo root
```
Then open http://localhost:8080. Opening `index.html` directly via `file://` also works. There are no tests, no lint, and no build to run.

## Architecture

One script (`app.js`) powers every page. The pages are static HTML shells (`index.html`, `product.html`, `cart.html`, `checkout.html`) that share `styles.css` and `app.js`. Coordination happens through two conventions:

- **`<body data-page="...">`** identifies the current page (`home`, etc.). `page()` reads it.
- **`data-*` attribute hooks** mark every interactive element and render target (e.g. `data-product-grid`, `data-cart-items`, `data-add-detail`, `data-checkout-form`). `app.js` finds these via `$`/`$$` helpers — there are almost no `id`/class lookups for behavior.

All interaction is wired through a **single delegated `click` listener** in `wireEvents()` (plus one `input` and one `keydown` listener). To add a behavior, add a `data-*` hook in HTML and a matching `e.target.closest('[data-...]')` branch in `wireEvents()` — do not attach per-element listeners.

`init()` runs unconditionally on load and calls every renderer (`renderGrid`, `renderProductDetail`, `renderCartEverywhere`, ...). Each renderer no-ops if its mount point (`[data-...]`) is absent, so the same `app.js` is safe to load on all pages. This is why render functions all start with `const mount = $(...); if(!mount) return;`.

### Data is the source of truth

- **`PRODUCTS`** (array at top of `app.js`) is the entire catalog — id, price, colors, sizes, copy, image paths. Product pages resolve via `?id=` query param through `productById()`, which falls back to the first product if the id is unknown.
- **`STORE`** (config object) holds brand name, currency, the order email, and the localStorage key. State derived from these (cart count, subtotal) is always computed from `PRODUCTS` + the cart, never stored.

### Cart & checkout

The cart is an array of `{id, color, size, qty}` persisted to `localStorage` under `STORE.localStorageKey` (`loadBag`/`saveBag`). After any mutation, call `renderCartEverywhere()` — it re-renders the drawer, cart page, and checkout summary together and updates all `[data-bag-count]`/`[data-subtotal]` elements at once.

**There is no payment backend.** Checkout (`submitCheckout`) builds a plain-text order via `orderText()` and opens a `mailto:` to `STORE.orderEmail`. `copyOrderText()` is the clipboard/WhatsApp fallback. To enable real payments, wire `STORE.paymentUrl` (Stripe Payment Link, Shopify, etc.) into the checkout/buy-now flow.

## Conventions

- Rendering is done by building HTML strings and assigning `innerHTML`; product data is interpolated directly, so keep `PRODUCTS` content trusted.
- Images use a `*_thumb.webp` (grid) / `*.webp` (detail, with `.jpg` fallback) naming pattern under `assets/`. Add both sizes when adding a product.
- The brand is intentionally independent of FIFA/World Cup/federation marks — do not add tournament crests without license rights (see `README_PRODUCTION.md`).


---

<!--K13_BROADCAST_START · managed by War Room — do not hand-edit-->
## 📡 War Room Broadcasts (org-wide rules)
> Synced from the K13 War Room. Each entry is a house rule that applies to every K13 project. Managed automatically — edit the rule in the War Room, not here.

<!--bc:2026-06-26-reports-archive-and-qa-->
### 2026-06-26 · Reports: archive every version + pass two-agent Chrome QA before "done"
**Archive every report — never overwrite.** Each report is written to `docs/reports/<Project>_<Type>_<YYYY-MM-DD>.html` (e.g. `Miramar_Development-Report_2026-06-25.html`). Same-day re-run → append `_v2`, `_v3`. The dated file is **permanent** — if the site links a "latest", copy/symlink to it, but never delete or overwrite an older dated report. Filenames are client-facing, so they carry the project name + type + date and explain themselves in an email. Types: `Development-Report`, `Security-Audit`, `Legal-Compliance`.

**No report is "done" until it passes the two-agent Chrome QA gate.** One agent **builds** the report; a second **tests** it — opens it in Chrome, screenshots desktop + mobile like a real user, and runs the design-review checklist (spacing, hierarchy, AI-slop, palette match, motion + `prefers-reduced-motion`, broken assets/links, Gmail-safe base64). Loop: fail → fix → re-review, until **design approval**. Only on PASS does the report take its final archived name and ship. Record the approval in a sidecar `docs/reports/<same-name>.qa.json` (date, screenshots, verdict) so "design signed off" is provable. Applies to **all** reports — dev, security, legal.

<!--bc:2026-06-26-imagegen-global-->
### 2026-06-26 · Image generation — free, via /imagegen (Gemini Nano Banana) + central pool
**Need an image? Generate it free with `/imagegen`.** Run `/imagegen <subject, style, aspect>` (or read `/Users/k13/Desktop/PROJECTS/K13-WarRoom/starter-kit/IMAGEGEN.md` and follow it). Engine: GStack Browser → Google Gemini (Nano Banana), free / no credits; fallback Bing Image Creator. The agent never types your password — it asks you to log in if prompted.

**Central pool, zero duplicates.** Every generated image lands first in the shared pool `/Users/k13/Desktop/PROJECTS/generatedAssets/` with a raw name (`gen_<proj>_<topic>_<n>.png`) and is **never committed**. On your approval the used image is **moved** (not copied) into this project's correct folder with a proper name; unused variants stay in the pool. Only the final relocated, renamed asset enters the repo — under this project's own git rules (branch → PR → merge).

<!--bc:2026-06-29-agent-agency-org-->
### 2026-08-13 · Team K13: named departments, the handoff contract & the autonomy contract
**K13 runs as team K13 — a controlled delivery pipeline, not a swarm.** Each AI specialist owns one repeatable stage, emits a predictable artifact, and hands off cleanly to the next. The **main Claude session is the GM (James)** — the only layer that sequences work (the hierarchy is flat: subagents don't spawn subagents, so agents never hand off to each other directly). **Jessica** runs Kazim's desk.

- **Roster + status legend:** `starter-kit/ORG.md` (War Room). Lean 7 to build first: Selma (`solutions-architect`) → Valentina (`brand-dna-designer`) → Natalia (`frontend-engineer`) → Olga (`qa-test-engineer`) → Irina (`security-auditor`) → Kate (`release-engineer`) → Gabi (`report-writer`). Human names are display labels; the functional `name:` is the routing key.
- **Handoff contract + Definition of Done:** `starter-kit/AGENT_HANDOFF_PROTOCOL.md`. Every delivery agent ends with the handoff block (Status / Summary / Files / Risks / Next / Human gate) and writes its artifact to `docs/handoffs/<stage>_<YYYY-MM-DD>.md` (same-day re-run → `_v2`, never overwrite).
- **Delegation is not optional.** James does not do a pipeline stage's work himself and call it done — every stage gets its named agent actually invoked (Task tool, `subagent_type` matching the agent file), even on a small project. **No artifact = the work never happened**: the War Room Org tab reads only `docs/handoffs/`, so skipping the artifact makes team K13 invisible on the board.
- **Autonomy contract — don't drip questions at Kazim.** Agents proceed by default. Only `Human gate` items come back to him: irreversible/destructive steps, money, real scope changes, anything that leaves for a client. Every other decision gets made, then **recorded in the handoff** instead of asked. Questions that genuinely survive are batched at the end of a run — never one at a time.
- **Parallel work:** sequential by default; James may fan out several agents **concurrently for independent work** (QA dimensions, security + a11y, research) and relay findings between them — each still writes its own handoff.
- **Agent vs skill:** token-heavy + isolatable → agent; in-context checklist/workflow → skill (compliance-checklist, media-generation).

<!--bc:2026-08-25-fitcheck-house-word-->
### 2026-08-25 · fitcheck: run the responsive-readiness pass after any layout, breakpoint or nav change
**Run `fitcheck` after any layout, breakpoint or nav change** — those are exactly the edits that regress one screen size while fixing another. `fitcheck` (alias `fit`) is the K13 responsive-readiness house pass: nine viewports (320 → 1920, including the two landscape sizes everyone forgets), a shared measurement harness with a trust gate, and the bug classes that only appear at one size — horizontal leaks, tap targets under the WCAG 2.5.8 AA floor, panels that are invisible but still in the tab order, scroll containers that strand their own header, and heroes that exactly fill a short viewport so nothing signals the page continues. It measures, looks, fixes at the source, and re-measures. It is also part of the P5 "done" checklist (`starter-kit/CONVENTIONS.md`). Skill: `~/.claude/skills/fitcheck/SKILL.md`.

<!--bc:2026-08-28-cc-commit-check-->
### 2026-08-28 · CC? — the pre-close commit check
**Ask `CC?` before closing a tab.** It means: "is anything lost if I close right now?" The session audits itself, read-only, and answers in one of two shapes: `✅ CC: safe to close` (one line of why), or `⚠️ CC: save these first` listing each unsaved item with a proposed save action, then waits for your pick. The sweep, in order: (1) git — uncommitted session work, unpushed commits, feature branches without a PR, open unmerged PRs (a repo's own known auto-refresh churn is excluded, not every dirty tree); (2) unwritten rules — corrections, decisions, or coined commands from the conversation not yet in this repo's `CLAUDE.md`/`Lessons.md`/memory; (3) deferrals not parked in a tracking ledger if this repo has one; (4) deliverables stranded in scratchpad/temp or outside any repo; (5) end of a working day — offer a journal/changelog entry if this repo keeps one, never auto-write it. `CC?` itself never saves anything — saving only happens after you choose.

<!--K13_BROADCAST_END-->
