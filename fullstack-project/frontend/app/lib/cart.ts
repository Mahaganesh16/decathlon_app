import { getStoredUser } from './auth';

const API_BASE = 'http://localhost:5000';

// Every visitor (logged in or not) gets a stable "owner id" so their cart
// is saved in the database and survives refreshes / new tabs.
export function getOwnerId(): string {
  if (typeof window === 'undefined') return 'server';

  const user = getStoredUser();
  if (user) return `user-${user.id}`;

  let guestId = localStorage.getItem('decathlon_guest_id');
  if (!guestId) {
    guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('decathlon_guest_id', guestId);
  }
  return guestId;
}

export interface CartProduct {
  id: number;
  brand: string;
  name: string;
  imageUrl: string;
  price: number;
  mrp: number;
  category: string;
}

export interface CartItem {
  id: number;
  ownerId: string;
  productId: number;
  quantity: number;
  product: CartProduct;
}

export interface CartResponse {
  items: CartItem[];
  totalMRP: number;
  totalPrice: number;
  discount: number;
}

// Small helper: if the response isn't ok, read the server's error body (if
// any) and throw an error that actually tells us what went wrong, instead of
// a generic message. This gets logged to the browser console.
async function assertOk(res: Response, action: string) {
  if (res.ok) return;
  let detail = '';
  try {
    const body = await res.json();
    detail = body?.error || JSON.stringify(body);
  } catch {
    detail = await res.text().catch(() => '');
  }
  console.error(`[cart] ${action} failed — status ${res.status} ${res.statusText}:`, detail);
  throw new Error(detail || `Failed to ${action}.`);
}

export async function addToCart(productId: number, quantity: number = 1) {
  console.log('[cart] addToCart called with', { ownerId: getOwnerId(), productId, quantity });
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ownerId: getOwnerId(), productId, quantity }),
  });
  await assertOk(res, 'add item to cart');
  return res.json();
}

export async function fetchCart(): Promise<CartResponse> {
  const res = await fetch(`${API_BASE}/api/cart/${getOwnerId()}`);
  await assertOk(res, 'fetch cart');
  return res.json();
}

export async function updateCartQuantity(productId: number, quantity: number) {
  const res = await fetch(`${API_BASE}/api/cart/${getOwnerId()}/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  await assertOk(res, 'update quantity');
  return res.json();
}

export async function removeFromCart(productId: number) {
  const res = await fetch(`${API_BASE}/api/cart/${getOwnerId()}/${productId}`, {
    method: 'DELETE',
  });
  await assertOk(res, 'remove item');
  return res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/api/cart/${getOwnerId()}`, {
    method: 'DELETE',
  });
  await assertOk(res, 'clear cart');
  return res.json();
}

// Call this right after a successful login, passing the guest id that was
// active *before* login. Moves any items added while browsing as a guest
// onto the now-logged-in user's account.
export async function mergeGuestCart(guestOwnerId: string, userOwnerId: string) {
  if (!guestOwnerId || guestOwnerId === userOwnerId) return;
  try {
    const res = await fetch(`${API_BASE}/api/cart/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestOwnerId, userOwnerId }),
    });
    await assertOk(res, 'merge cart');
  } catch (err) {
    console.error('[cart] merge failed:', err);
  }
}