# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free storefront for the GURBET "Türkiye Drops" merch brand. No framework, no build step, no package manager, no backend. Plain HTML + CSS + a single vanilla-JS file. The git repository root is the parent directory (`Gurbet_Store/`); all app files live in `gurbet_official_store/`.

## Running

```bash
python3 -m http.server 8080   # run from inside gurbet_official_store/
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
