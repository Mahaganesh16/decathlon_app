'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';
import { getStoredUser, logout, AuthUser } from '../lib/auth';
import { fetchWishlist, removeFromWishlist, WishlistItem } from '../lib/wishlist';
import { addToCart } from '../lib/cart';

export default function WishlistPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await fetchWishlist();
      setItems(data.items);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error('Failed to remove item:', err);
      loadWishlist();
    }
  };

  const handleAddToCart = async (productId: number) => {
    setAddingProductId(productId);
    try {
      await addToCart(productId, 1);
      router.push('/cart');
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      alert('Could not add item to cart. Please try again.');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  return (
    <div className="bg-white text-black antialiased min-h-screen w-full font-sans flex flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
        <header className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="text-3xl font-black uppercase text-[#007dba] tracking-tighter cursor-pointer italic select-none"
          >
            DECATHLON
          </Link>

          <div className="flex-1 max-w-2xl relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5-12m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder='Search for "Rain Co"|'
              className="w-full bg-[#f2f2f2] rounded-full text-sm pl-10 pr-4 py-2.5 focus:outline-none border border-transparent focus:border-gray-300 transition-all font-medium"
              readOnly
            />
          </div>

          <div className="flex items-center gap-6 text-[11px] text-gray-800">
            {user ? (
              <div className="flex flex-col items-center gap-1">
                <AccountIcon />
                <span className="font-bold">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] normal-case font-semibold text-gray-500 hover:text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
                <AccountIcon />
                <span className="font-bold">Account</span>
              </Link>
            )}

            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
              <StoreIcon />
              <span className="font-bold">My Store</span>
            </div>

            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
              <SupportIcon />
              <span className="font-bold">Support</span>
            </div>

            <div className="flex flex-col items-center gap-1 cursor-pointer text-blue-600 relative">
              <HeartIcon filled />
              <span className="font-bold">Wishlist</span>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#ef3340] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </div>

            <div
              onClick={() => router.push('/cart')}
              className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600"
            >
              <CartIcon />
              <span className="font-bold">Cart</span>
            </div>
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center justify-between text-xs font-bold text-gray-800">
          <div className="flex items-center gap-8">
            <span className="cursor-pointer hover:text-blue-600">All Sports</span>
            <span className="cursor-pointer hover:text-blue-600">Men</span>
            <span className="cursor-pointer hover:text-blue-600">Women</span>
            <span className="cursor-pointer hover:text-blue-600">Kids</span>
          </div>
          <div className="text-gray-500 font-normal">
            Delivery to{' '}
            <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
              Bangalore Central, Bangalore, 560001, Karnataka
            </span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-[1400px] w-full mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-gray-950">Wishlist</h1>
          {items.length > 0 && (
            <span className="text-sm text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#007dba] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <h2 className="text-2xl font-black text-gray-900">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500">Save items you love so you can find them later.</p>
            <Link
              href="/"
              className="mt-2 bg-[#3643ba] hover:bg-[#2d38a0] text-white text-sm font-black px-6 py-3 rounded-sm transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {items.map((item) => {
              const product = item.product;
              const filledStars = Math.round(product.rating || 4.5);
              return (
                <div key={item.id} className="flex flex-col">
                  <div className="relative aspect-square bg-gray-50 rounded-xs overflow-hidden">
                    <Link href={`/product/${product.id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600';
                        }}
                      />
                    </Link>
                    <button
                      onClick={() => handleRemove(product.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 text-gray-800"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  <Link href={`/product/${product.id}`} className="mt-3">
                    <h4 className="text-sm leading-snug">
                      <span className="font-black text-gray-900">{product.brand}</span>{' '}
                      <span className="text-gray-700 line-clamp-2">{product.name}</span>
                    </h4>
                  </Link>

                  {product.rating && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex text-amber-500 text-xs leading-none tracking-tighter">
                        {'★'.repeat(filledStars)}
                        <span className="text-gray-300">{'★'.repeat(5 - filledStars)}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-semibold">{product.reviews}</span>
                    </div>
                  )}

                  <div className="mt-1.5 text-sm">
                    <span className="text-gray-600">MRP </span>
                    <span className="font-black text-gray-950">₹{product.mrp || product.price}</span>
                  </div>

                  {product.discountTag && (
                    <div className="inline-block w-fit bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full mt-2">
                      {product.discountTag}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingProductId === product.id}
                    className="mt-3 w-fit bg-white border border-gray-950 text-black text-xs font-black px-5 py-2 rounded-xs hover:bg-gray-950 hover:text-white transition-all uppercase disabled:opacity-50"
                  >
                    {addingProductId === product.id ? 'Adding...' : 'Add to cart'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function AccountIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}