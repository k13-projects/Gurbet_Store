const STORE = {
  name: 'GURBET',
  tagline: 'Türkiye Drops',
  currency: '$',
  orderEmail: 'orders@gurbet.example',
  paymentUrl: '',
  localStorageKey: 'gurbet-official-bag-v1'
};

const PRODUCTS = [
  {
    id:'w-classic-crop',
    name:'Hilal Crop Jersey',
    audience:'Women',
    category:'women',
    price:54,
    badge:'Best seller',
    tags:['women','best'],
    image:'assets/women_classic_crop_thumb.webp',
    large:'assets/women_classic_crop.webp',
    colors:['Red','White'],
    sizes:['XS','S','M','L','XL'],
    fit:'Boxy cropped fit',
    copy:'A sharp cropped jersey with ay-yıldız detail, sleeve motif, and bold TÜRKİYE chest typography.'
  },
  {
    id:'w-vertical-stripe',
    name:'Vertical Stripe Crop',
    audience:'Women',
    category:'women',
    price:58,
    badge:'New drop',
    tags:['women','best'],
    image:'assets/women_vertical_stripe_thumb.webp',
    large:'assets/women_vertical_stripe.webp',
    colors:['Red','White'],
    sizes:['XS','S','M','L','XL'],
    fit:'Premium crop jersey',
    copy:'A fashion-forward vertical stripe jersey with clean V-neck trim and tonal texture.'
  },
  {
    id:'w-heritage-vneck',
    name:'1923 Heritage V-Neck',
    audience:'Women',
    category:'women',
    price:62,
    badge:'Boutique piece',
    tags:['women','best'],
    image:'assets/women_heritage_vneck_thumb.webp',
    large:'assets/women_heritage_vneck.webp',
    colors:['Deep Red','White'],
    sizes:['XS','S','M','L','XL'],
    fit:'Relaxed V-neck',
    copy:'Soft designer V-neck with ornate trim, tonal pattern, ay-yıldız mark, and 1923 detail.'
  },
  {
    id:'m-minimal-performance',
    name:'Minimal Performance Tee',
    audience:'Men',
    category:'men',
    price:54,
    badge:'Clean fit',
    tags:['men'],
    image:'assets/men_minimal_performance_thumb.webp',
    large:'assets/men_minimal_performance.webp',
    colors:['Red','White'],
    sizes:['S','M','L','XL','XXL'],
    fit:'Athletic fit',
    copy:'Minimal Türkiye jersey with subtle tonal geometry and a restrained premium finish.'
  },
  {
    id:'m-luxury-1923',
    name:'Palace Relief V-Neck',
    audience:'Men',
    category:'men',
    price:68,
    badge:'Signature',
    tags:['men','best'],
    image:'assets/men_luxury_1923_thumb.webp',
    large:'assets/men_luxury_1923.webp',
    colors:['White','Deep Red'],
    sizes:['S','M','L','XL','XXL'],
    fit:'Luxury V-neck',
    copy:'The elevated hero piece: embossed ornamental texture, side panel detail, and elegant 1923 finish.'
  },
  {
    id:'m-stadium-oversized',
    name:'Stadium Oversized Jersey',
    audience:'Men',
    category:'men',
    price:58,
    badge:'Fan zone ready',
    tags:['men','best'],
    image:'assets/men_stadium_oversized_thumb.webp',
    large:'assets/men_stadium_oversized.webp',
    colors:['Red','White'],
    sizes:['S','M','L','XL','XXL'],
    fit:'Oversized street fit',
    copy:'Street-luxury oversized jersey with shoulder striping, bold chest type, and match-day confidence.'
  }
];

let bag = loadBag();
let activeFilter = 'all';
let selectedProduct = null;
let selectedColor = null;
let selectedSize = null;
let selectedQty = 1;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => `${STORE.currency}${Number(n).toFixed(0)}`;
function loadBag(){
  try{return JSON.parse(localStorage.getItem(STORE.localStorageKey) || '[]')}catch{return []}
}
function saveBag(){localStorage.setItem(STORE.localStorageKey, JSON.stringify(bag));}
function productById(id){return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];}
function bagCount(){return bag.reduce((sum,item)=>sum+item.qty,0);}
function subtotal(){return bag.reduce((sum,item)=>sum + productById(item.id).price * item.qty,0);}
function page(){return document.body.dataset.page;}

function productCard(product){
  return `
    <a class="product-card" href="product.html?id=${product.id}" data-product-card data-category="${product.category}" data-tags="${product.tags.join(',')}">
      <span class="tag">${product.badge}</span>
      <div class="product-img"><img src="${product.image}" alt="${product.name} by GURBET Türkiye Drops" loading="lazy"></div>
      <div class="product-meta">
        <div class="product-meta-row">
          <div><h3>${product.name}</h3><p>${product.audience} · ${product.fit}</p></div>
          <span class="price">${money(product.price)}</span>
        </div>
        <span class="btn ghost quick">Select size</span>
      </div>
    </a>`;
}

function renderGrid(){
  const grid = $('[data-product-grid]');
  if(!grid) return;
  const visible = PRODUCTS.filter(p => activeFilter === 'all' || p.category === activeFilter || p.tags.includes(activeFilter));
  grid.innerHTML = visible.map(productCard).join('');
}

function setFilter(button){
  activeFilter = button.dataset.filter;
  $$('.filter').forEach(btn => btn.classList.toggle('active', btn === button));
  renderGrid();
}

function renderProductDetail(){
  const mount = $('[data-product-detail]');
  if(!mount) return;
  const params = new URLSearchParams(window.location.search);
  selectedProduct = productById(params.get('id'));
  selectedColor = selectedProduct.colors[0];
  selectedSize = selectedProduct.sizes.includes('M') ? 'M' : selectedProduct.sizes[0];
  selectedQty = 1;
  document.title = `${selectedProduct.name} | GURBET Türkiye Drops`;
  mount.innerHTML = `
    <div class="detail-media">
      <picture><source srcset="${selectedProduct.large}" type="image/webp"><img src="${selectedProduct.large}" alt="${selectedProduct.name} campaign image"></picture>
    </div>
    <div class="detail-copy">
      <p class="eyebrow">${selectedProduct.audience} · ${selectedProduct.fit}</p>
      <h1>${selectedProduct.name}</h1>
      <div class="detail-price">${money(selectedProduct.price)}</div>
      <p>${selectedProduct.copy}</p>
      <div class="option-block">
        <div class="option-title"><span>Color</span><b data-selected-color>${selectedColor}</b></div>
        <div class="chips" data-color-chips>${selectedProduct.colors.map(c => `<button class="chip ${c===selectedColor?'active':''}" type="button" data-color="${c}">${c}</button>`).join('')}</div>
      </div>
      <div class="option-block">
        <div class="option-title"><span>Size</span><b data-selected-size>${selectedSize}</b></div>
        <div class="chips" data-size-chips>${selectedProduct.sizes.map(s => `<button class="chip ${s===selectedSize?'active':''}" type="button" data-size="${s}">${s}</button>`).join('')}</div>
      </div>
      <div class="option-block">
        <div class="option-title"><span>Quantity</span><b data-selected-qty>${selectedQty}</b></div>
        <div class="qty"><button type="button" data-qty-minus aria-label="Decrease quantity">−</button><input data-qty-input value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity"><button type="button" data-qty-plus aria-label="Increase quantity">+</button></div>
      </div>
      <div class="product-actions">
        <button class="btn primary" type="button" data-add-detail>Add to bag</button>
        <button class="btn ghost" type="button" data-buy-now>Buy now</button>
      </div>
      <p class="micro">Official GURBET storefront. Independent Türkiye-inspired merch capsule.</p>
    </div>`;
  renderRelated(selectedProduct.id);
}

function renderRelated(currentId){
  const related = $('[data-related-products]');
  if(!related) return;
  related.innerHTML = PRODUCTS.filter(p => p.id !== currentId).slice(0,3).map(productCard).join('');
}

function addItem(id, color, size, qty = 1){
  const existing = bag.find(item => item.id === id && item.color === color && item.size === size);
  if(existing) existing.qty += qty;
  else bag.push({id, color, size, qty});
  saveBag();
  renderCartEverywhere();
  showToast('Added to bag');
}
function setQty(value){
  selectedQty = Math.max(1, Math.min(10, Number(value) || 1));
  const input = $('[data-qty-input]');
  if(input) input.value = selectedQty;
  const label = $('[data-selected-qty]');
  if(label) label.textContent = selectedQty;
}
function renderCartEverywhere(){
  $$('[data-bag-count]').forEach(el => el.textContent = bagCount());
  $$('[data-subtotal]').forEach(el => el.textContent = money(subtotal()));
  renderDrawer();
  renderCartPage();
  renderCheckout();
}
function cartLine(item, index, mode='drawer'){
  const product = productById(item.id);
  if(mode === 'page'){
    return `
      <article class="cart-page-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${item.color} · ${item.size} · ${money(product.price)} each</p>
          <div class="cart-controls">
            <button class="small-btn" type="button" data-decrease="${index}">−</button>
            <strong>Qty ${item.qty}</strong>
            <button class="small-btn" type="button" data-increase="${index}">+</button>
            <button class="small-btn" type="button" data-remove="${index}">Remove</button>
          </div>
        </div>
        <strong class="line-total">${money(product.price * item.qty)}</strong>
      </article>`;
  }
  return `
    <article class="cart-item">
      <img src="${product.image}" alt="${product.name}">
      <div><h4>${product.name}</h4><p>${item.color} · ${item.size}<br>Qty ${item.qty} · ${money(product.price * item.qty)}</p></div>
      <button class="remove" type="button" data-remove="${index}">Remove</button>
    </article>`;
}
function renderDrawer(){
  const mount = $('[data-cart-items]');
  if(!mount) return;
  mount.innerHTML = bag.length ? bag.map((item,index)=>cartLine(item,index)).join('') : `<div class="empty">Your bag is empty. Pick a drop piece and choose your size.</div>`;
}
function renderCartPage(){
  const mount = $('[data-cart-page-items]');
  if(!mount) return;
  mount.innerHTML = bag.length ? bag.map((item,index)=>cartLine(item,index,'page')).join('') : `<div class="empty">Your cart is empty. <a href="index.html#shop">Go shop the drop.</a></div>`;
}
function renderCheckout(){
  const mount = $('[data-checkout-items]');
  if(!mount) return;
  mount.innerHTML = bag.length ? bag.map(item => {
    const product = productById(item.id);
    return `<article class="checkout-item"><img src="${product.image}" alt="${product.name}"><div><h4>${product.name}</h4><p>${item.color} · ${item.size} · Qty ${item.qty}</p></div><strong>${money(product.price * item.qty)}</strong></article>`;
  }).join('') : `<div class="empty">Your bag is empty. <a href="index.html#shop">Add a product first.</a></div>`;
}
function openCart(){
  const drawer = $('[data-cart-drawer]');
  if(!drawer) return;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
}
function closeCart(){
  const drawer = $('[data-cart-drawer]');
  if(!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}
function removeItem(index){bag.splice(index,1);saveBag();renderCartEverywhere();}
function changeItemQty(index, delta){
  if(!bag[index]) return;
  bag[index].qty += delta;
  if(bag[index].qty <= 0) bag.splice(index,1);
  saveBag(); renderCartEverywhere();
}
function orderText(extra={}){
  const items = bag.map(item => {
    const p = productById(item.id);
    return `${item.qty}x ${p.name} / ${item.color} / ${item.size} / ${money(p.price * item.qty)}`;
  }).join('\n');
  return `GURBET Türkiye Drops Order\n\n${items}\n\nSubtotal: ${money(subtotal())}\n\nName: ${extra.name || ''}\nEmail: ${extra.email || ''}\nPhone: ${extra.phone || ''}\nHandle: ${extra.handle || ''}\nDelivery/Pickup: ${extra.delivery || ''}`;
}
function submitCheckout(form){
  if(!bag.length){showToast('Bag is empty'); return;}
  const data = Object.fromEntries(new FormData(form).entries());
  const subject = encodeURIComponent('GURBET Türkiye Drops order');
  const body = encodeURIComponent(orderText(data));
  window.location.href = `mailto:${STORE.orderEmail}?subject=${subject}&body=${body}`;
}
async function copyOrderText(){
  if(!bag.length){showToast('Bag is empty'); return;}
  try{await navigator.clipboard.writeText(orderText()); showToast('Order text copied');}
  catch{showToast('Could not copy text');}
}
function showToast(text){
  let toast = $('.toast');
  if(!toast){toast = document.createElement('div'); toast.className='toast'; document.body.appendChild(toast);}
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(window.__toast);
  window.__toast = setTimeout(()=>toast.classList.remove('show'), 1800);
}

function wireEvents(){
  document.addEventListener('click', e => {
    const filter = e.target.closest('[data-filter]'); if(filter){setFilter(filter); return;}
    if(e.target.closest('[data-open-cart]')){openCart(); return;}
    if(e.target.closest('[data-close-cart]')){closeCart(); return;}
    if(e.target === $('[data-cart-drawer]')){closeCart(); return;}
    const color = e.target.closest('[data-color]');
    if(color){selectedColor = color.dataset.color; $$('[data-color]').forEach(btn => btn.classList.toggle('active', btn === color)); const label=$('[data-selected-color]'); if(label) label.textContent = selectedColor; return;}
    const size = e.target.closest('[data-size]');
    if(size){selectedSize = size.dataset.size; $$('[data-size]').forEach(btn => btn.classList.toggle('active', btn === size)); const label=$('[data-selected-size]'); if(label) label.textContent = selectedSize; return;}
    if(e.target.closest('[data-qty-minus]')){setQty(selectedQty - 1); return;}
    if(e.target.closest('[data-qty-plus]')){setQty(selectedQty + 1); return;}
    if(e.target.closest('[data-add-detail]')){addItem(selectedProduct.id, selectedColor, selectedSize, selectedQty); openCart(); return;}
    if(e.target.closest('[data-buy-now]')){addItem(selectedProduct.id, selectedColor, selectedSize, selectedQty); window.location.href='checkout.html'; return;}
    const remove = e.target.closest('[data-remove]'); if(remove){removeItem(Number(remove.dataset.remove)); return;}
    const dec = e.target.closest('[data-decrease]'); if(dec){changeItemQty(Number(dec.dataset.decrease), -1); return;}
    const inc = e.target.closest('[data-increase]'); if(inc){changeItemQty(Number(inc.dataset.increase), 1); return;}
    if(e.target.closest('[data-scroll-to-products]')){document.querySelector('#shop')?.scrollIntoView({behavior:'smooth'}); return;}
    if(e.target.closest('[data-whatsapp-order]')){copyOrderText(); return;}
  });
  document.addEventListener('input', e => {
    if(e.target.matches('[data-qty-input]')) setQty(e.target.value);
  });
  const checkoutForm = $('[data-checkout-form]');
  if(checkoutForm) checkoutForm.addEventListener('submit', e => {e.preventDefault(); submitCheckout(checkoutForm);});
  document.addEventListener('keydown', e => {if(e.key === 'Escape') closeCart();});
}

function init(){
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  renderGrid();
  renderProductDetail();
  renderCartEverywhere();
  wireEvents();
}
init();
