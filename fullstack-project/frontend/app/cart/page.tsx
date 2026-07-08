'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';
import { getStoredUser, logout, AuthUser } from '../lib/auth';
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  CartItem,
} from '../lib/cart';

function formatDeliveryDate(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';
  const month = d.toLocaleString('en-US', { month: 'short' });
  return `${day}${suffix} ${month} ${d.getFullYear()}`;
}

export default function CartPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalMRP, setTotalMRP] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rewardsOn, setRewardsOn] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await fetchCart();
      setItems(data.items);
      setTotalMRP(data.totalMRP);
      setTotalPrice(data.totalPrice);
      setDiscount(data.discount);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = async (productId: number, nextQty: number) => {
    if (nextQty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: nextQty } : i))
    );
    try {
      await updateCartQuantity(productId, nextQty);
      loadCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      loadCart();
    }
  };

  const handleRemove = async (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    try {
      await removeFromCart(productId);
      loadCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
      loadCart();
    }
  };

  const handleClearCart = async () => {
    if (items.length === 0) return;
    if (!confirm('Remove all items from your cart?')) return;
    try {
      await clearCart();
      setItems([]);
      setTotalMRP(0);
      setTotalPrice(0);
      setDiscount(0);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  const savings = discount;

  return (
    <div className="bg-white text-black antialiased min-h-screen w-full font-sans flex flex-col">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
        <header className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="text-3xl font-black uppercase text-[#007dba] tracking-tighter cursor-pointer italic select-none"
          >
            DECATHLON
          </Link>
          <div className="flex items-center gap-6 text-xs font-bold text-gray-700 whitespace-nowrap">
            {user ? (
              <div className="flex flex-col items-center">
                <span>Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] normal-case font-semibold text-gray-500 hover:text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">Sign In</Link>
            )}
            <span>My Store</span>
            <span>Support</span>
          </div>
        </header>
      </div>

      <main className="max-w-[1400px] w-full mx-auto px-4 py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-[#007dba]"
          >
            <span aria-hidden>←</span> Back to Shop
          </Link>
          <div className="text-2xl font-black uppercase text-[#007dba] tracking-tighter italic select-none">
            DECATHLON
          </div>
          <div className="w-[110px]" />
        </div>

        <div className="flex items-center gap-2 mb-8">
          <div className="h-1.5 flex-1 rounded-full bg-[#3643ba]" />
          <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
          <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#007dba] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
            <p className="text-sm text-gray-500">Looks like you haven&apos;t added anything yet.</p>
            <Link
              href="/"
              className="mt-2 bg-[#3643ba] hover:bg-[#2d38a0] text-white text-sm font-black px-6 py-3 rounded-sm transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-black text-gray-950">Cart Items</h1>
                <button
                  onClick={handleClearCart}
                  aria-label="Clear cart"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="border-t border-gray-200" />

              <div className="flex items-center gap-3 py-4">
                <PinIcon />
                <span className="text-sm text-gray-800">
                  Delivery to{' '}
                  <span className="font-bold text-blue-700">
                    Bangalore Central, Bangalore, 560001, Karnataka
                  </span>
                </span>
                <Link href="/account/address" className="ml-auto text-sm font-bold text-blue-700 hover:underline">
                  Add address
                </Link>
              </div>

              <div className="border-t border-gray-200" />

              {items.map((item) => {
                const { product } = item;
                return (
                  <div key={item.id} className="flex gap-6 py-6 border-b border-gray-100">
                    <div className="w-36 h-36 flex-shrink-0 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600';
                        }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="text-base text-gray-900">
                        <span className="font-black uppercase">{product.brand}</span>
                        {'  |  '}
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm text-gray-600">Qty</span>
                        <div className="flex items-center border border-gray-300 rounded-sm">
                          <button
                            onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-lg font-black text-gray-950">
                          ₹{product.price * item.quantity}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-sm text-gray-400">
                            MRP <span className="line-through">₹{(product.mrp * item.quantity).toLocaleString('en-IN')}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          aria-label="Add to wishlist"
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-950 text-gray-700"
                        >
                          <HeartIcon />
                        </button>
                        <button
                          aria-label="Remove item"
                          onClick={() => handleRemove(item.productId)}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:border-red-500 hover:text-red-500 text-gray-700"
                        >
                          <TrashIcon small />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-4 text-sm text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        Delivery by <span className="font-bold">{formatDeliveryDate(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 h-fit lg:sticky lg:top-20">
              <button className="w-full flex items-center justify-between border border-gray-200 rounded-md px-4 py-4 hover:border-gray-400 transition-colors">
                <span className="flex items-center gap-3 text-sm font-bold text-gray-900">
                  <TagIcon /> Apply Coupon
                </span>
                <span className="text-gray-400">›</span>
              </button>

              <div className="border border-gray-200 rounded-md px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-sm font-bold text-gray-900">
                    <CoinIcon /> Sporty Rewards: ₹0
                    <InfoIcon />
                  </span>
                  <button
                    onClick={() => setRewardsOn((v) => !v)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                      rewardsOn ? 'bg-[#007dba]' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle Sporty Rewards"
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        rewardsOn ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-8">Available Balance: ₹0</p>
              </div>

              <div className="mt-1">
                <h2 className="text-2xl font-black text-gray-950 mb-4">Order Summary</h2>

                <div className="flex items-center justify-between text-sm text-gray-800 mb-3">
                  <span>Total MRP</span>
                  <span>₹{totalMRP.toLocaleString('en-IN')}.00</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-emerald-600 font-semibold mb-3">
                    <span>Discount on MRP</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <p className="text-xs text-gray-400 mb-4">Convenience fee will be calculated on next step</p>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-gray-950">Total</span>
                  <span className="text-xl font-black text-gray-950">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="mt-4 bg-emerald-50 text-emerald-700 text-sm font-bold text-center py-3 rounded-sm">
                    You saved ₹{savings.toLocaleString('en-IN')} on this order
                  </div>
                )}

                <button
                  onClick={() => router.push('/account/address')}
                  className="w-full mt-4 bg-[#3643ba] hover:bg-[#2d38a0] text-white text-base font-black py-4 rounded-sm transition-colors"
                >
                  Add or choose address
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function TrashIcon({ small }: { small?: boolean }) {
  const size = small ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-gray-700">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-amber-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-amber-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.725 0 1.45.22 2.003.659l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  );
}