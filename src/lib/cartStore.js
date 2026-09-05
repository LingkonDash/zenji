/**
 * cartStore — centralised localStorage helpers for Cart & Wishlist.
 *
 * Every mutation dispatches a custom "cart-store-update" event on `window`
 * so any mounted component (Navbar, cards, etc.) can re-read counts in
 * real-time without prop-drilling or a global state library.
 *
 * Products are stored as arrays of product objects, de-duped by `id`.
 */

const CART_KEY = "zenji_cart";
const WISHLIST_KEY = "zenji_wishlist";

// ─── helpers ────────────────────────────────────────────────────────────────

function safeGet(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function safeSet(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("cart-store-update"));
  } catch {
    // quota exceeded — silently fail
  }
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export function getCart() {
  return safeGet(CART_KEY);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
}

/**
 * Add a product to the cart. If it already exists, increment its quantity.
 * @param {Object} product — must have at least an `id` field
 */
export function addToCart(product) {
  if (!product?.id) return;
  const cart = getCart();
  const idx = cart.findIndex((p) => p.id === product.id);
  if (idx !== -1) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  safeSet(CART_KEY, cart);
}

export function removeFromCart(productId) {
  safeSet(
    CART_KEY,
    getCart().filter((p) => p.id !== productId)
  );
}

export function updateCartQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex((p) => p.id === productId);
  if (idx === -1) return;
  if (qty <= 0) {
    cart.splice(idx, 1);
  } else {
    cart[idx].qty = qty;
  }
  safeSet(CART_KEY, cart);
}

export function clearCart() {
  safeSet(CART_KEY, []);
}

export function isInCart(productId) {
  return getCart().some((p) => p.id === productId);
}

// ─── Wishlist ───────────────────────────────────────────────────────────────

export function getWishlist() {
  return safeGet(WISHLIST_KEY);
}

export function getWishlistCount() {
  return getWishlist().length;
}

/**
 * Toggle a product in/out of the wishlist.
 * @returns {boolean} `true` if the item was added, `false` if removed.
 */
export function toggleWishlist(product) {
  if (!product?.id) return false;
  const list = getWishlist();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx !== -1) {
    list.splice(idx, 1);
    safeSet(WISHLIST_KEY, list);
    return false;
  }
  list.push({ ...product });
  safeSet(WISHLIST_KEY, list);
  return true;
}

export function addToWishlist(product) {
  if (!product?.id) return;
  const list = getWishlist();
  if (list.some((p) => p.id === product.id)) return;
  list.push({ ...product });
  safeSet(WISHLIST_KEY, list);
}

export function removeFromWishlist(productId) {
  safeSet(
    WISHLIST_KEY,
    getWishlist().filter((p) => p.id !== productId)
  );
}

export function clearWishlist() {
  safeSet(WISHLIST_KEY, []);
}

export function isInWishlist(productId) {
  return getWishlist().some((p) => p.id === productId);
}

// ─── React hook helper ──────────────────────────────────────────────────────

/**
 * Subscribe to cart/wishlist changes. Returns an unsubscribe function.
 * @param {() => void} callback
 */
export function onStoreChange(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("cart-store-update", callback);
  return () => window.removeEventListener("cart-store-update", callback);
}
