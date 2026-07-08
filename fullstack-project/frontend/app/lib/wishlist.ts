import { getOwnerId } from './cart';

const API_BASE = 'http://localhost:5000';

export interface WishlistProduct {
  id: number;
  brand: string;
  name: string;
  imageUrl: string;
  price: number;
  mrp: number;
  category: string;
  rating?: number;
  reviews?: string;
  discountTag?: string | null;
}

export interface WishlistItem {
  id: number;
  ownerId: string;
  productId: number;
  product: WishlistProduct;
}

export interface WishlistResponse {
  items: WishlistItem[];
}

async function assertOk(res: Response, action: string) {
  if (res.ok) return;
  let detail = '';
  try {
    const body = await res.json();
    detail = body?.error || JSON.stringify(body);
  } catch {
    detail = await res.text().catch(() => '');
  }
  console.error(`[wishlist] ${action} failed — status ${res.status} ${res.statusText}:`, detail);
  throw new Error(detail || `Failed to ${action}.`);
}

export async function addToWishlist(productId: number) {
  const res = await fetch(`${API_BASE}/api/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ownerId: getOwnerId(), productId }),
  });
  await assertOk(res, 'add item to wishlist');
  return res.json();
}

export async function fetchWishlist(): Promise<WishlistResponse> {
  const res = await fetch(`${API_BASE}/api/wishlist/${getOwnerId()}`);
  await assertOk(res, 'fetch wishlist');
  return res.json();
}

export async function removeFromWishlist(productId: number) {
  const res = await fetch(`${API_BASE}/api/wishlist/${getOwnerId()}/${productId}`, {
    method: 'DELETE',
  });
  await assertOk(res, 'remove item');
  return res.json();
}

export async function clearWishlist() {
  const res = await fetch(`${API_BASE}/api/wishlist/${getOwnerId()}`, {
    method: 'DELETE',
  });
  await assertOk(res, 'clear wishlist');
  return res.json();
}