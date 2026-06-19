# GURBET | Türkiye Drops Official Store

Production-style static storefront for the GURBET merch website.

## Files

- `index.html` — home + product grid
- `product.html?id=...` — product page with color, size, quantity, add to bag, buy now
- `cart.html` — cart page
- `checkout.html` — order request checkout form
- `styles.css` — full responsive styling
- `app.js` — products, cart, checkout flow
- `assets/logo-gurbet.svg` — full logo
- `assets/logo-mark.svg` — app/favicon mark
- `assets/*.webp / *.jpg` — realistic campaign product images

## How to run locally

Open `index.html` in the browser, or run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## What to change before paid ads

In `app.js`:

```js
const STORE = {
  orderEmail: 'orders@gurbet.example',
  paymentUrl: '',
};
```

Replace `orderEmail` with the real order email. For real payments, connect one of these:

1. Shopify product pages and replace checkout behavior with Shopify links.
2. Stripe Payment Links and redirect checkout to your link.
3. A backend checkout API.

## Product data

Products live in `app.js` inside the `PRODUCTS` array. Update price, name, size, colors, and image paths there.

## Legal / brand note

The site uses GURBET as the official storefront brand and Türkiye Drops as the tagline. The product visuals avoid federation/tournament branding. Do not add FIFA, World Cup, or federation crests unless you have license rights.
