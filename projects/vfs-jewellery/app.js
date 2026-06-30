/* =========================================================
   VFS Jewellery — App Logic
   ========================================================= */

// ── Product Data ──
const PRODUCTS = [
  { id: 1, name: 'Celestial Halo Ring', cat: 'rings', meta: 'Gold Plated', price: 899, mrp: 1799, img: 'assets/rings.webp', rating: 4.8, reviews: 312, badge: 'Bestseller' },
  { id: 2, name: 'Aurora Drop Earrings', cat: 'earrings', meta: 'CZ Crystal', price: 749, mrp: 1499, img: 'assets/earrings.webp', rating: 4.7, reviews: 287, badge: 'New' },
  { id: 3, name: 'Eternal Love Pendant', cat: 'necklaces', meta: 'Gold Plated', price: 1199, mrp: 2399, img: 'assets/necklaces.webp', rating: 4.9, reviews: 456, badge: 'Most Gifted' },
  { id: 4, name: 'Twisted Rope Bracelet', cat: 'bracelets', meta: 'Rose Gold', price: 649, mrp: 1299, img: 'assets/bracelets.webp', rating: 4.6, reviews: 198, badge: '' },
  { id: 5, name: 'CZ Solitaire Studs', cat: 'earrings', meta: 'Gold Plated', price: 599, mrp: 1199, img: 'assets/earrings.webp', rating: 4.9, reviews: 524, badge: 'Bestseller' },
  { id: 6, name: 'Infinity Band Ring', cat: 'rings', meta: 'Rose Gold', price: 799, mrp: 1599, img: 'assets/rings.webp', rating: 4.5, reviews: 176, badge: '' },
  { id: 7, name: 'Pearl Chain Necklace', cat: 'necklaces', meta: 'Gold Plated', price: 1399, mrp: 2799, img: 'assets/necklaces.webp', rating: 4.8, reviews: 389, badge: 'Trending' },
  { id: 8, name: 'Charm Link Bracelet', cat: 'bracelets', meta: 'Gold Plated', price: 849, mrp: 1699, img: 'assets/bracelets.webp', rating: 4.7, reviews: 243, badge: 'New' },
  { id: 9, name: 'Diamond Cut Hoops', cat: 'earrings', meta: 'CZ Crystal', price: 699, mrp: 1399, img: 'assets/earrings.webp', rating: 4.6, reviews: 167, badge: '' },
  { id: 10, name: 'Floral Statement Ring', cat: 'rings', meta: 'Oxidised', price: 549, mrp: 1099, img: 'assets/rings.webp', rating: 4.4, reviews: 134, badge: '' },
  { id: 11, name: 'Layered Chain Set', cat: 'necklaces', meta: 'Gold Plated', price: 1599, mrp: 3199, img: 'assets/necklaces.webp', rating: 4.9, reviews: 412, badge: 'Most Gifted' },
  { id: 12, name: 'Tennis Bracelet CZ', cat: 'bracelets', meta: 'Rose Gold', price: 1099, mrp: 2199, img: 'assets/bracelets.webp', rating: 4.8, reviews: 298, badge: 'Trending' },
];

const TESTIMONIALS = [
  { name: 'Priya M.', text: 'The quality is amazing for this price! My friends thought it was real gold. The anti-tarnish coating really works — been wearing it daily for 3 months.', stars: 5 },
  { name: 'Ananya S.', text: 'Ordered the pendant set as a gift for my mom. The packaging was so premium, she was thrilled! The CZ stones genuinely sparkle.', stars: 5 },
  { name: 'Riya K.', text: 'Best imitation jewellery brand I\'ve found. No skin irritation, gorgeous designs, and delivery was super fast. Already ordered my 4th piece!', stars: 5 },
  { name: 'Sneha P.', text: 'The halo ring looks exactly like the ones I saw at Tanishq but at a fraction of the cost. VFS has earned a loyal customer.', stars: 4 },
  { name: 'Kavya D.', text: 'I was skeptical about online jewellery but VFS exceeded expectations. The gold plating is thick and the weight feels premium.', stars: 5 },
  { name: 'Meera R.', text: 'Bought couple rings for our anniversary. Perfect fit, beautiful finish, and the gift box made it extra special. Highly recommend!', stars: 5 },
];

// ── State ──
let cart = [];
try {
  const storedCart = localStorage.getItem('vfs_cart');
  cart = storedCart ? JSON.parse(storedCart) : [];
  if (!Array.isArray(cart)) cart = [];
} catch (e) {
  cart = [];
}

let wishlist = [];
try {
  const storedWl = localStorage.getItem('vfs_wl');
  wishlist = storedWl ? JSON.parse(storedWl) : [];
  if (!Array.isArray(wishlist)) wishlist = [];
} catch (e) {
  wishlist = [];
}

// ── Helpers ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmt = (n) => '₹' + n.toLocaleString('en-IN');
const pct = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);
const stars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '');

function saveState() {
  localStorage.setItem('vfs_cart', JSON.stringify(cart));
  localStorage.setItem('vfs_wl', JSON.stringify(wishlist));
}

// ── Toast ──
function toast(msg) {
  const box = $('#toastBox');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>${msg}`;
  box.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2800);
}

// ── Announcement Bar Rotation ──
(function initAnnouncement() {
  const slides = $$('#annSlider .announcement-slide');
  if (slides.length < 2) return;
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 3000);
})();

// ── Sticky Header Shadow ──
window.addEventListener('scroll', () => {
  $('#siteHeader').classList.toggle('scrolled', window.scrollY > 10);
});

// ── Hero Slider ──
(function initHero() {
  const slides = $$('#heroSlider .hero-slide');
  const dotsContainer = $('#heroDots');
  if (!slides.length) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goSlide(i));
    dotsContainer.appendChild(dot);
  });

  let cur = 0;
  function goSlide(n) {
    slides[cur].classList.remove('active');
    dotsContainer.children[cur].classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');
    dotsContainer.children[cur].classList.add('active');
  }

  setInterval(() => goSlide((cur + 1) % slides.length), 5000);
})();

// ── Render Product Grid ──
function renderProducts(filter) {
  const grid = $('#productGrid');
  const list = filter && filter !== 'all' ? PRODUCTS.filter(p => p.cat === filter) : PRODUCTS;

  grid.innerHTML = list.map(p => {
    const isWL = wishlist.includes(p.id);
    const off = pct(p.price, p.mrp);
    return `
      <div class="p-card" data-id="${p.id}">
        ${p.badge ? `<span class="p-badge${p.badge === 'Sale' ? ' sale' : ''}">${p.badge}</span>` : ''}
        <button class="p-wish${isWL ? ' active' : ''}" data-wl="${p.id}" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" fill="${isWL ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
        </button>
        <div class="p-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <div class="p-quick" data-add="${p.id}">Add to Cart</div>
        </div>
        <div class="p-info">
          <div class="p-meta">${p.meta}</div>
          <div class="p-name">${p.name}</div>
          <div class="p-rating"><span class="stars">${stars(p.rating)}</span><span class="count">(${p.reviews})</span></div>
          <div class="p-prices">
            <span class="price-now">${fmt(p.price)}</span>
            <span class="price-was">${fmt(p.mrp)}</span>
            <span class="price-off">${off}% OFF</span>
          </div>
        </div>
      </div>`;
  }).join('');

  // Wishlist buttons
  grid.querySelectorAll('[data-wl]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = +btn.dataset.wl;
      if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        toast('Removed from wishlist');
      } else {
        wishlist.push(id);
        toast('Added to wishlist ♡');
      }
      saveState();
      updateCounts();
      renderProducts(currentFilter);
    });
  });

  // Quick add buttons
  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(+btn.dataset.add);
    });
  });

  // Card click triggers PDP
  grid.querySelectorAll('.p-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = +card.dataset.id;
      openPDP(id);
    });
  });
}

let currentFilter = null;

// ── Category Click ──
$$('.cat-item').forEach(el => {
  el.addEventListener('click', () => {
    currentFilter = el.dataset.cat;
    renderProducts(currentFilter);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
});

// Mega menu filter links
$$('.mega-menu a[data-filter]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    currentFilter = a.dataset.filter;
    renderProducts(currentFilter);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Cart Logic ──
function addToCart(id) {
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveState();
  updateCounts();
  renderCart();
  openDrawer('cart');
  toast('Added to cart ✓');
}

function renderCart() {
  const body = $('#cartBody');
  const foot = $('#cartFoot');

  if (!cart.length) {
    body.innerHTML = `<div class="dw-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>Your cart is empty</p></div>`;
    foot.style.display = 'none';
    return;
  }

  foot.style.display = '';
  let total = 0;

  body.innerHTML = cart.map(ci => {
    const p = PRODUCTS.find(x => x.id === ci.id);
    if (!p) return '';
    total += p.price * ci.qty;
    return `
      <div class="dw-item" data-id="${p.id}">
        <img class="dw-item-img dw-pdp-link" src="${p.img}" alt="${p.name}" style="cursor:pointer">
        <div>
          <div class="dw-item-meta">${p.meta}</div>
          <div class="dw-item-name dw-pdp-link" style="cursor:pointer">${p.name}</div>
          <div class="dw-item-price">${fmt(p.price)}</div>
          <div class="qty-ctrl">
            <button data-qty="${p.id}" data-d="-1">−</button>
            <span>${ci.qty}</span>
            <button data-qty="${p.id}" data-d="1">+</button>
          </div>
        </div>
        <button class="dw-rm" data-rm="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
      </div>`;
  }).join('');

  $('#cartTotal').textContent = fmt(total);

  // Qty buttons
  body.querySelectorAll('[data-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.qty;
      const d = +btn.dataset.d;
      const ci = cart.find(c => c.id === id);
      if (ci) {
        ci.qty += d;
        if (ci.qty < 1) cart = cart.filter(c => c.id !== id);
      }
      saveState();
      updateCounts();
      renderCart();
    });
  });

  // Remove buttons
  body.querySelectorAll('[data-rm]').forEach(btn => {
    btn.addEventListener('click', () => {
      cart = cart.filter(c => c.id !== +btn.dataset.rm);
      saveState();
      updateCounts();
      renderCart();
      toast('Item removed');
    });
  });

  // PDP links click
  body.querySelectorAll('.dw-pdp-link').forEach(el => {
    el.addEventListener('click', () => {
      const id = +el.closest('.dw-item').dataset.id;
      if (id === 99) return; // ignore gift wrap item
      closeDrawer('cart');
      openPDP(id);
    });
  });
}

// ── Wishlist Drawer ──
function renderWishlist() {
  const body = $('#wlBody');
  if (!wishlist.length) {
    body.innerHTML = `<div class="dw-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg><p>Your wishlist is empty</p></div>`;
    return;
  }

  body.innerHTML = wishlist.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return '';
    return `
      <div class="dw-item" data-id="${p.id}">
        <img class="dw-item-img dw-pdp-link" src="${p.img}" alt="${p.name}" style="cursor:pointer">
        <div>
          <div class="dw-item-meta">${p.meta}</div>
          <div class="dw-item-name dw-pdp-link" style="cursor:pointer">${p.name}</div>
          <div class="dw-item-price">${fmt(p.price)} <span class="price-was" style="font-weight:400">${fmt(p.mrp)}</span></div>
          <button style="margin-top:6px;padding:6px 16px;background:#121212;color:#D4AF37;border-radius:4px;font-size:1.1rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em" data-wl-add="${p.id}">Add to Cart</button>
        </div>
        <button class="dw-rm" data-wl-rm="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
      </div>`;
  }).join('');

  body.querySelectorAll('[data-wl-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(+btn.dataset.wlAdd);
    });
  });

  body.querySelectorAll('[data-wl-rm]').forEach(btn => {
    btn.addEventListener('click', () => {
      wishlist = wishlist.filter(x => x !== +btn.dataset.wlRm);
      saveState();
      updateCounts();
      renderWishlist();
      renderProducts(currentFilter);
      toast('Removed from wishlist');
    });
  });

  // PDP links click
  body.querySelectorAll('.dw-pdp-link').forEach(el => {
    el.addEventListener('click', () => {
      const id = +el.closest('.dw-item').dataset.id;
      closeDrawer('wl');
      openPDP(id);
    });
  });
}

// ── Testimonials ──
function renderTestimonials() {
  const grid = $('#testGrid');
  grid.innerHTML = TESTIMONIALS.slice(0, 3).map(t => `
    <div class="test-card">
      <div class="test-stars">${'★'.repeat(t.stars)}${'☆'.repeat(5 - t.stars)}</div>
      <div class="test-text">"${t.text}"</div>
      <div class="test-author">— ${t.name}</div>
    </div>`).join('');
}

// ── Update Badge Counts ──
function updateCounts() {
  const cCount = cart.reduce((s, c) => s + c.qty, 0);
  $('#cartCount').textContent = cCount;
  $('#cartCT').textContent = cCount;
  $('#wlCount').textContent = wishlist.length;
  $('#wlCT').textContent = wishlist.length;
}

// ── Drawer Open/Close ──
function openDrawer(type) {
  if (type === 'cart') {
    renderCart();
    $('#cartBG').classList.add('active');
    $('#cartDW').classList.add('active');
  } else {
    renderWishlist();
    $('#wlBG').classList.add('active');
    $('#wlDW').classList.add('active');
  }
  document.body.style.overflow = 'hidden';
}

function closeDrawer(type) {
  if (type === 'cart') {
    $('#cartBG').classList.remove('active');
    $('#cartDW').classList.remove('active');
  } else {
    $('#wlBG').classList.remove('active');
    $('#wlDW').classList.remove('active');
  }
  document.body.style.overflow = '';
}

$('#openCart').addEventListener('click', () => openDrawer('cart'));
$('#closeCartDW').addEventListener('click', () => closeDrawer('cart'));
$('#cartBG').addEventListener('click', () => closeDrawer('cart'));

$('#openWL').addEventListener('click', () => openDrawer('wl'));
$('#closeWLDW').addEventListener('click', () => closeDrawer('wl'));
$('#wlBG').addEventListener('click', () => closeDrawer('wl'));

// ── Search ──
$('#openSearch').addEventListener('click', () => {
  $('#searchOL').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#searchInput').focus(), 100);
});

$('#closeSearch').addEventListener('click', () => {
  $('#searchOL').classList.remove('active');
  document.body.style.overflow = '';
});

$('#searchOL').addEventListener('click', (e) => {
  if (e.target === $('#searchOL')) {
    $('#searchOL').classList.remove('active');
    document.body.style.overflow = '';
  }
});

$('#searchInput').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const results = $('#searchResults');
  if (!q) { results.innerHTML = ''; return; }

  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.cat.includes(q) ||
    p.meta.toLowerCase().includes(q)
  );

  results.innerHTML = matches.length
    ? matches.map(p => `
        <div class="sr-item" data-sr="${p.id}">
          <img class="sr-img" src="${p.img}" alt="${p.name}">
          <div class="sr-info"><h4>${p.name}</h4><span>${fmt(p.price)}</span></div>
        </div>`).join('')
    : '<div style="padding:16px;text-align:center;color:#999;font-size:1.3rem">No results found</div>';

  results.querySelectorAll('[data-sr]').forEach(el => {
    el.addEventListener('click', () => {
      const id = +el.dataset.sr;
      $('#searchOL').classList.remove('active');
      document.body.style.overflow = '';
      $('#searchInput').value = '';
      results.innerHTML = '';
      openPDP(id);
    });
  });
});

// ── Pincode ──
$('#openPin').addEventListener('click', () => {
  $('#pinModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#pinInput').focus(), 100);
});

$('#closePin').addEventListener('click', () => {
  $('#pinModal').classList.remove('active');
  document.body.style.overflow = '';
});

$('#pinModal').addEventListener('click', (e) => {
  if (e.target === $('#pinModal')) {
    $('#pinModal').classList.remove('active');
    document.body.style.overflow = '';
  }
});

$('#checkPin').addEventListener('click', () => {
  const val = $('#pinInput').value.trim();
  const res = $('#pinResult');
  if (!/^\d{6}$/.test(val)) {
    res.className = 'pin-result err';
    res.textContent = 'Please enter a valid 6-digit pincode';
    return;
  }
  // Simulate check
  const days = 2 + Math.floor(Math.random() * 4);
  res.className = 'pin-result ok';
  res.innerHTML = `✓ Delivery available! Estimated ${days}–${days + 2} business days.<br><span style="font-weight:400;color:#666">Free shipping on orders above ₹499</span>`;
});

// ── Checkout ──
$('#checkoutBtn').addEventListener('click', () => {
  toast('Checkout coming soon! 🎉');
});

// ── Newsletter ──
$('#nlForm').addEventListener('submit', (e) => {
  e.preventDefault();
  toast('Subscribed! Welcome to VFS Circle ✉️');
  e.target.reset();
});

// ── Keyboard: Escape closes overlays ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $('#searchOL').classList.remove('active');
    $('#pinModal').classList.remove('active');
    closePDP();
    closeStoreLocator();
    closeDrawer('cart');
    closeDrawer('wl');
  }
});

// ── PDP Overlay Logic ──
function openPDP(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const overlay = $('#pdpOverlay');
  
  // 1. Image Gallery
  const mainImgContainer = $('#pdpMainImg');
  mainImgContainer.innerHTML = `<img id="pdpMainImgEl" src="${p.img}" alt="${p.name}">`;

  const thumbsContainer = $('#pdpThumbs');
  const images = [
    p.img,
    'assets/hero_banner.webp',
    p.img
  ];
  
  thumbsContainer.innerHTML = images.map((imgSrc, idx) => `
    <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
      <img src="${imgSrc}" alt="${p.name} - Angle ${idx + 1}">
    </div>
  `).join('');

  thumbsContainer.querySelectorAll('.pdp-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbsContainer.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const idx = +thumb.dataset.idx;
      $('#pdpMainImgEl').src = images[idx];
    });
  });

  // 2. Details Info
  const isWL = wishlist.includes(p.id);
  const off = pct(p.price, p.mrp);
  const infoContainer = $('#pdpInfo');
  
  infoContainer.innerHTML = `
    <span class="pdp-meta">${p.meta} • 18K Plated</span>
    <h1 class="pdp-title">${p.name}</h1>
    <div class="pdp-rating">
      <span class="pdp-rating-stars">${stars(p.rating)}</span>
      <span class="pdp-rating-count">(${p.reviews} Reviews)</span>
    </div>
    
    <div class="pdp-price-box">
      <span class="pdp-price-now">${fmt(p.price)}</span>
      <span class="pdp-price-was">${fmt(p.mrp)}</span>
      <span class="pdp-price-off">${off}% OFF</span>
    </div>
    
    <p class="pdp-desc">
      Upgrade your styling with this premium handcrafted VFS creation. Featuring a brilliant A++ Austrian CZ crystal centerpiece that captures light like real diamonds. Built with hypoallergenic, nickel-free brass alloy and finished with a 365-day anti-tarnish protective shield.
    </p>
    
    <div class="pdp-spec-list">
      <div class="pdp-spec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>365-Day Anti-Tarnish</div>
      <div class="pdp-spec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/><path d="m9 12 2 2 4-4"/></svg>Skin Safe & Nickel-Free</div>
      <div class="pdp-spec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>Premium Austrian CZ</div>
      <div class="pdp-spec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Free Delivery & COD</div>
    </div>
    
    <label class="pdp-gift-wrap">
      <input type="checkbox" id="pdpGiftWrap">
      <span>Add Premium VFS Gift Box & Ribbon (+₹49)</span>
    </label>
    
    <div class="pdp-actions">
      <button class="pdp-btn-add" id="pdpBtnAdd" data-id="${p.id}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Add to Cart
      </button>
      <button class="pdp-btn-wish ${isWL ? 'active' : ''}" id="pdpBtnWish" data-id="${p.id}" aria-label="Wishlist">
        <svg viewBox="0 0 24 24" fill="${isWL ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
      </button>
    </div>
    
    <div class="pdp-delivery">
      <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>Delivery Availability Check</h4>
      <div class="pdp-delivery-checker">
        <input type="text" placeholder="Enter Pincode" id="pdpPinInput" maxlength="6">
        <button id="pdpPinCheck">Check</button>
      </div>
      <div id="pdpPinResult" class="pdp-pin-result"></div>
    </div>
  `;

  // Attach action event listeners
  $('#pdpBtnAdd').addEventListener('click', () => {
    const isGiftChecked = $('#pdpGiftWrap').checked;
    addToCart(p.id);
    if (isGiftChecked) {
      addGiftWrapToCart();
    }
  });

  const btnWish = $('#pdpBtnWish');
  btnWish.addEventListener('click', () => {
    if (wishlist.includes(p.id)) {
      wishlist = wishlist.filter(x => x !== p.id);
      btnWish.classList.remove('active');
      btnWish.querySelector('svg').setAttribute('fill', 'none');
      toast('Removed from wishlist');
    } else {
      wishlist.push(p.id);
      btnWish.classList.add('active');
      btnWish.querySelector('svg').setAttribute('fill', 'currentColor');
      toast('Added to wishlist ♡');
    }
    saveState();
    updateCounts();
    renderProducts(currentFilter);
  });

  $('#pdpPinCheck').addEventListener('click', () => {
    const val = $('#pdpPinInput').value.trim();
    const res = $('#pdpPinResult');
    if (!/^\d{6}$/.test(val)) {
      res.className = 'pdp-pin-result err';
      res.textContent = 'Please enter a valid 6-digit pincode';
      return;
    }
    const days = 2 + Math.floor(Math.random() * 4);
    res.className = 'pdp-pin-result ok';
    res.innerHTML = `✓ Delivery available! Estimated ${days}–${days + 2} business days.`;
  });

  // 3. Related Products
  const relatedContainer = $('#pdpRelated');
  const relatedProducts = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  
  if (relatedProducts.length > 0) {
    relatedContainer.innerHTML = relatedProducts.map(rp => {
      const isRpWL = wishlist.includes(rp.id);
      const rpOff = pct(rp.price, rp.mrp);
      return `
        <div class="p-card" data-id="${rp.id}">
          ${rp.badge ? `<span class="p-badge">${rp.badge}</span>` : ''}
          <button class="p-wish${isRpWL ? ' active' : ''}" data-wl="${rp.id}" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" fill="${isRpWL ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
          </button>
          <div class="p-img">
            <img src="${rp.img}" alt="${rp.name}">
            <div class="p-quick" data-add="${rp.id}">Add to Cart</div>
          </div>
          <div class="p-info">
            <div class="p-meta">${rp.meta}</div>
            <div class="p-name">${rp.name}</div>
            <div class="p-rating"><span class="stars">${stars(rp.rating)}</span><span class="count">(${rp.reviews})</span></div>
            <div class="p-prices">
              <span class="price-now">${fmt(rp.price)}</span>
              <span class="price-was">${fmt(rp.mrp)}</span>
              <span class="price-off">${rpOff}% OFF</span>
            </div>
          </div>
        </div>`;
    }).join('');

    relatedContainer.querySelectorAll('.p-card').forEach(card => {
      card.addEventListener('click', () => {
        const rId = +card.dataset.id;
        openPDP(rId);
        overlay.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    relatedContainer.querySelectorAll('[data-wl]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wlId = +btn.dataset.wl;
        if (wishlist.includes(wlId)) {
          wishlist = wishlist.filter(x => x !== wlId);
          toast('Removed from wishlist');
        } else {
          wishlist.push(wlId);
          toast('Added to wishlist ♡');
        }
        saveState();
        updateCounts();
        openPDP(p.id);
      });
    });

    relatedContainer.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(+btn.dataset.add);
      });
    });
  } else {
    relatedContainer.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#999;padding:24px;">No related items found</p>`;
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePDP() {
  $('#pdpOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function addGiftWrapToCart() {
  const giftWrapId = 99;
  const existingProduct = PRODUCTS.find(x => x.id === giftWrapId);
  if (!existingProduct) {
    PRODUCTS.push({
      id: giftWrapId,
      name: 'Premium VFS Gift Box & Ribbon',
      cat: 'services',
      meta: 'Gift Pack',
      price: 49,
      mrp: 49,
      img: 'assets/bracelets.webp',
      rating: 5,
      reviews: 0,
      badge: 'Gift'
    });
  }
  
  const existingInCart = cart.find(c => c.id === giftWrapId);
  if (!existingInCart) {
    cart.push({ id: giftWrapId, qty: 1 });
    saveState();
    updateCounts();
    renderCart();
  }
}

// Back to shop button in PDP
$('#pdpBack').addEventListener('click', closePDP);

// ── Scroll to Top Behavior ──
window.addEventListener('scroll', () => {
  const btn = $('#scrollTopBtn');
  if (window.scrollY > 300) {
    btn.classList.add('show');
  } else {
    btn.classList.remove('show');
  }
});
$('#scrollTopBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Catch Placeholder Links ──
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (a && a.getAttribute('href') === '#') {
    e.preventDefault();
    toast(`${a.textContent.trim() || 'Feature'} coming soon! 💎`);
  }
});

// ── Store Locator Logic ──
const STORES = [
  {
    name: "VFS Jewels Sowcarpet",
    address: "42, 2nd Floor, Natwar Kurpa Complex, Narayana Mudali Street, Sowcarpet, George Town, Chennai - 600001",
    link: "https://www.google.com/search?q=VFS+JEWELS+Jewellery+Wholesaler+Sowcarpet+Chennai",
    badge: "Flagship Wholesaler"
  },
  {
    name: "VFS Jewels T. Nagar",
    address: "12, Usman Road, opposite Tanishq, T. Nagar, Chennai - 600017",
    link: "https://www.google.com/search?q=VFS+JEWELS+Jewellery+Wholesaler+Sowcarpet+Chennai",
    badge: "Retail Hub"
  },
  {
    name: "VFS Jewels Adyar",
    address: "85, Sardar Patel Road, opposite IIT Madras, Adyar, Chennai - 600020",
    link: "https://www.google.com/search?q=VFS+JEWELS+Jewellery+Wholesaler+Sowcarpet+Chennai",
    badge: "Boutique"
  },
  {
    name: "VFS Jewels Velachery",
    address: "4, Velachery Main Road, near Phoenix Marketcity, Velachery, Chennai - 600042",
    link: "https://www.google.com/search?q=VFS+JEWELS+Jewellery+Wholesaler+Sowcarpet+Chennai",
    badge: "Experience Center"
  }
];

function openStoreLocator() {
  const shuffled = [...STORES].sort(() => 0.5 - Math.random());
  
  const listContainer = $('#storeList');
  listContainer.innerHTML = shuffled.map(s => `
    <div class="store-card">
      <div class="store-card-name">
        <span>${s.name}</span>
        <span class="store-card-badge">${s.badge}</span>
      </div>
      <div class="store-card-address">${s.address}</div>
      <div class="store-card-actions">
        <a href="${s.link}" target="_blank" rel="noopener" class="btn-store-dir">
          Get Directions →
        </a>
      </div>
    </div>
  `).join('');

  $('#storeOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeStoreLocator() {
  $('#storeOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

$('#openStore').addEventListener('click', openStoreLocator);
$('#closeStore').addEventListener('click', closeStoreLocator);
$('#storeOverlay').addEventListener('click', (e) => {
  if (e.target === $('#storeOverlay')) {
    closeStoreLocator();
  }
});

// ── Google Review Modal Logic ──
const REVIEW_TEXT_DEFAULT = "Absolutely love VFS Jewellery! Their 18K gold-plated designs are stunning, the anti-tarnish protective shield works wonders, and the customer service is outstanding. Highly recommended for retail and wholesale purchases! 💎✨";
let selectedReviewStars = 5;

function openReviewModal() {
  const modal = $('#googleReviewModal');
  if (modal) {
    modal.classList.add('active');
  }
  const reviewText = $('#modalReviewText');
  if (reviewText) {
    reviewText.value = REVIEW_TEXT_DEFAULT;
  }
  updateReviewStars(5);
  document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
  const modal = $('#googleReviewModal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function updateReviewStars(rating) {
  selectedReviewStars = rating;
  const starsContainer = $('#modalReviewStars');
  if (!starsContainer) return;
  const starsList = starsContainer.querySelectorAll('.star');
  starsList.forEach((star, idx) => {
    if (idx < rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });

  const labels = {
    1: 'Hated it (1/5) 😡',
    2: 'Disliked it (2/5) 🙁',
    3: 'It was OK (3/5) 😐',
    4: 'Liked it (4/5) 🙂',
    5: 'Loved it (5/5) 😍'
  };
  const labelEl = $('#revStarsLabel');
  if (labelEl) {
    labelEl.textContent = labels[rating] || 'Loved it (5/5) 😍';
  }
}

function handleReviewSubmit() {
  const modalBody = $('.rev-modal-body');
  if (!modalBody) return;
  
  const savedStars = selectedReviewStars;
  
  modalBody.innerHTML = `
    <div class="review-success-state" style="text-align:center; padding:30px 10px; animation: fadeUp 0.3s ease;">
      <div style="width:60px; height:60px; border-radius:50%; background:#27ae60; color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:3rem">✓</div>
      <h3 style="font-size:2rem; margin-bottom:10px; color:#121212">Review Submitted!</h3>
      <p style="font-size:1.35rem; color:#666; margin-bottom:20px; line-height:1.5">
        Thank you for your rating of <strong>${savedStars} Stars</strong>.<br>
        Redirecting you to Google to post it officially...
      </p>
    </div>
  `;
  
  // Open google writereview in new tab
  setTimeout(() => {
    window.open('https://search.google.com/local/writereview?placeid=ChIJGeNBXJ1vUjoRKvwj5pfrrCk', '_blank');
    closeReviewModal();
    // Reset modal content after closing transition finishes
    setTimeout(() => {
      modalBody.innerHTML = `
        <div class="rev-modal-stars" id="modalReviewStars">
          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>
        </div>
        <p class="rev-stars-label" id="revStarsLabel">Excellent (5/5)</p>
        <textarea id="modalReviewText" rows="5" placeholder="Share details of your experience..."></textarea>
        <div class="rev-modal-actions">
          <button class="btn-rev-cancel" id="cancelReviewModal">Cancel</button>
          <button class="btn-rev-submit" id="submitReviewModal">Post Review</button>
        </div>
      `;
      // Re-attach listeners
      $('#cancelReviewModal').addEventListener('click', closeReviewModal);
      $('#submitReviewModal').addEventListener('click', handleReviewSubmit);
      $('#modalReviewStars').querySelectorAll('.star').forEach(s => {
        s.addEventListener('click', () => {
          const val = +s.dataset.value;
          updateReviewStars(val);
        });
      });
    }, 500);
  }, 2000);
}

// Bind Review Modal events
const openReviewBtn = $('#openReviewBtn');
if (openReviewBtn) {
  openReviewBtn.addEventListener('click', openReviewModal);
}
const closeReviewModalBtn = $('#closeReviewModal');
if (closeReviewModalBtn) {
  closeReviewModalBtn.addEventListener('click', closeReviewModal);
}
const cancelReviewModalBtn = $('#cancelReviewModal');
if (cancelReviewModalBtn) {
  cancelReviewModalBtn.addEventListener('click', closeReviewModal);
}
const submitReviewBtn = $('#submitReviewModal');
if (submitReviewBtn) {
  submitReviewBtn.addEventListener('click', handleReviewSubmit);
}
const googleReviewModalEl = $('#googleReviewModal');
if (googleReviewModalEl) {
  googleReviewModalEl.addEventListener('click', (e) => {
    if (e.target === googleReviewModalEl) {
      closeReviewModal();
    }
  });
}
const modalStars = $$('#modalReviewStars .star');
modalStars.forEach(star => {
  star.addEventListener('click', () => {
    const val = +star.dataset.value;
    updateReviewStars(val);
  });
});

// Also update Escape key listener to close this modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeReviewModal();
  }
});

// ── Video Call Modal Logic ──
function openVCModal() {
  const modal = $('#vcModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVCModal() {
  const modal = $('#vcModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

const openVCDialogBtn = $('#openVCDialog');
if (openVCDialogBtn) {
  openVCDialogBtn.addEventListener('click', openVCModal);
}
const closeVCModalBtn = $('#closeVCModal');
if (closeVCModalBtn) {
  closeVCModalBtn.addEventListener('click', closeVCModal);
}
const vcModalEl = $('#vcModal');
if (vcModalEl) {
  vcModalEl.addEventListener('click', (e) => {
    if (e.target === vcModalEl) {
      closeVCModal();
    }
  });
}

// Form submission handler
const vcForm = $('#vcForm');
if (vcForm) {
  vcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#vcName').value.trim();
    const phone = $('#vcPhone').value.trim();
    const slot = $('input[name="vcTime"]:checked').value;

    const message = `Hi VFS Jewellery! I'd like to schedule a Live Video Call to view your jewellery collection.\n\nName: ${name}\nWhatsApp: ${phone}\nPreferred Slot: ${slot}`;

    const waLink = `https://wa.me/919840757363?text=${encodeURIComponent(message)}`;
    
    // Open in new tab
    window.open(waLink, '_blank');
    
    // Reset and close
    vcForm.reset();
    closeVCModal();
    toast('Video Call request sent! 📞');
  });
}

// Escape key listener extension
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVCModal();
  }
});

// ── Init ──
renderProducts(null);
renderTestimonials();
updateCounts();
