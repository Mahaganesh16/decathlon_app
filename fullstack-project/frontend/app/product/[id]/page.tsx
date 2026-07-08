'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { getStoredUser, logout, AuthUser } from '../../lib/auth';
import { addToCart, fetchCart } from '../../lib/cart';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../lib/wishlist';

interface Product {
  id: number;
  brand: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviews: string;
  price: number;
  mrp: number;
  discountTag: string | null;
  category: string;
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    refreshCartCount();
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [productId]);

  const refreshCartCount = async () => {
    try {
      const cart = await fetchCart();
      const totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    } catch (err) {
      console.error('Failed to load cart count:', err);
    }
  };

  const refreshWishlist = async () => {
    try {
      const wishlist = await fetchWishlist();
      setWishlistCount(wishlist.items.length);
      setWishlisted(wishlist.items.some((i) => i.productId === Number(productId)));
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      await refreshCartCount();
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      alert('Could not add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    setWishlistBusy(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
      await refreshWishlist();
    } catch (err) {
      console.error('Failed to update wishlist:', err);
      alert('Could not update wishlist. Please try again.');
    } finally {
      setWishlistBusy(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    if (!productId) return;
    fetch(`http://localhost:5000/api/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product || null);
        setRelated(data.related || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Product detail fetch failed:', err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#007dba] border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <h2 className="text-xl font-black text-gray-900">Product not found</h2>
        <Link href="/" className="text-[#007dba] font-bold underline">Back to homepage</Link>
      </div>
    );
  }

  const filledStars = Math.round(product.rating);

  return (
    <div className="bg-white text-black antialiased min-h-screen w-full font-sans">
      {/* STICKY NAVBAR - same as homepage */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
        <header className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="text-3xl font-black uppercase text-[#007dba] tracking-tighter cursor-pointer italic select-none">
            DECATHLON
          </Link>
          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder={`Search for "${product.category}"`}
              className="w-full bg-gray-100 rounded-full py-2 pl-9 pr-4 text-sm outline-none"
              readOnly
            />
          </div>
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
            <span
              onClick={() => router.push('/wishlist')}
              className="relative cursor-pointer hover:text-[#007dba]"
            >
              Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#ef3340] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span
              onClick={() => router.push('/cart')}
              className="relative cursor-pointer hover:text-[#007dba]"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#007dba] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
          </div>
        </header>
        <div className="max-w-[1400px] mx-auto px-4 h-10 flex items-center gap-6 text-sm font-bold text-gray-800">
          <span>All Sports</span>
          <span>Men</span>
          <span>Women</span>
          <span>Kids</span>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* BREADCRUMB */}
        <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-4">
          <span>Sports Clothing</span>
          <span>{'>'}</span>
          <span>Trousers &amp; Trackpants</span>
          <span>{'>'}</span>
          <span className="font-bold text-gray-900">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          {/* LEFT: IMAGE GALLERY */}
          <div>
            <div className="grid grid-cols-2 gap-1 bg-gray-50 rounded-xs overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[600px] object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800';
                }}
              />
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[600px] object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800';
                }}
              />
            </div>

            {/* BENEFITS SECTION */}
            <section className="mt-10">
              <h2 className="text-2xl font-black text-gray-950 mb-6">Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Moisture Management', desc: 'Breathable and quick-dry fabric' },
                  { title: 'Pockets', desc: '2 large zip pockets' },
                  { title: 'Ventilation', desc: 'Mesh panel at the back' },
                ].map((b) => (
                  <div key={b.title} className="bg-gray-50 rounded-sm p-5 flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <h4 className="font-black text-sm text-gray-900">{b.title}</h4>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* REVIEWS SECTION */}
            <section className="mt-12 border-t border-gray-100 pt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-gray-950">Reviews</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-black text-gray-950">{Number(product.rating).toFixed(1)}</span>
                    <span className="text-gray-500 mb-2">out of 5</span>
                  </div>
                  <p className="text-[#007dba] font-semibold text-sm mt-1">{product.reviews} reviews</p>

                  <div className="mt-5 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      // Rough visual distribution derived from the overall rating
                      const pct = star === filledStars ? 70 : star < filledStars ? 15 : 5;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-2">{star}</span>
                          <span>★</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-900" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-6">
                    <div className="text-amber-500 text-sm mb-2">{'★'.repeat(filledStars)}<span className="text-gray-300">{'★'.repeat(5 - filledStars)}</span></div>
                    <h4 className="font-black text-lg text-gray-900 mb-2">Good product</h4>
                    <p className="text-sm text-gray-600">Comfortable fit and true to size. Would recommend for daily gym use.</p>
                    <p className="text-xs text-gray-400 mt-3">Verified User | India</p>
                  </div>
                  <div>
                    <div className="text-amber-500 text-sm mb-2">{'★'.repeat(filledStars)}<span className="text-gray-300">{'★'.repeat(5 - filledStars)}</span></div>
                    <h4 className="font-black text-lg text-gray-900 mb-2">Good</h4>
                    <p className="text-sm text-gray-600">Great quality material, breathable and light.</p>
                    <p className="text-xs text-gray-400 mt-3">Verified User | India</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: PURCHASE PANEL */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{product.brand}</span>
              <span className="text-xs text-gray-400">ID {product.id}</span>
            </div>
            <h1 className="text-2xl font-black text-gray-950 leading-snug mt-1 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500 text-sm">
                {'★'.repeat(filledStars)}<span className="text-gray-300">{'★'.repeat(5 - filledStars)}</span>
              </span>
              <span className="text-sm font-bold text-gray-900">{product.rating}</span>
              <span className="text-sm text-[#007dba] font-semibold">{product.reviews} reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-2xl font-black text-gray-950">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-sm text-gray-400">
                  MRP <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                </span>
              )}
            </div>
            {product.discountTag && (
              <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-sm mb-4">
                {product.discountTag}
              </div>
            )}

            {/* SIZE SELECTOR */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">Select size</span>
                <span className="text-sm text-[#007dba] font-semibold cursor-pointer">Size chart</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-11 rounded-sm border text-sm font-bold transition-colors ${
                      selectedSize === size
                        ? 'border-gray-950 bg-gray-950 text-white'
                        : 'border-gray-300 text-gray-900 hover:border-gray-950'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* WISHLIST + ADD TO CART */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistBusy}
                aria-label="Add to wishlist"
                className={`w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-sm border transition-colors disabled:opacity-50 ${
                  wishlisted ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700 hover:border-gray-950'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 h-14 bg-[#3643ba] hover:bg-[#2d38a0] text-white text-base font-black rounded-sm transition-colors disabled:opacity-50"
              >
                {addingToCart ? 'Adding...' : 'Add to cart'}
              </button>
            </div>

            {/* TRUST ICONS ROW */}
            <div className="flex items-center gap-6 mt-6 text-xs text-gray-700">
              <span className="flex items-center gap-1.5"><span>✓</span> 2 year warranty</span>
              <span className="flex items-center gap-1.5"><span>🇮🇳</span> Made In India</span>
              <span className="flex items-center gap-1.5"><span>↩</span> 30 days return</span>
            </div>

            {/* DELIVERY & SERVICES */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="font-black text-sm text-gray-900 mb-3">Delivery &amp; services</h3>
              <p className="text-xs text-gray-500 mb-3">Sold and fulfilled by: Decathlon Sports India Pvt Ltd</p>
              <div className="text-sm space-y-2 text-gray-700">
                <p>• Standard delivery by <span className="font-semibold">08th Jul 2026</span></p>
                <p>• Pick up from store within 2 Hours for FREE</p>
                <p>• Pay on Delivery available *</p>
              </div>
            </div>

            {/* COMPLETE YOUR KIT */}
            {related.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="font-black text-sm text-gray-900 mb-3">Complete your kit</h3>
                <div className="grid grid-cols-4 gap-2">
                  {related.map((item) => (
                    <Link key={item.id} href={`/product/${item.id}`} className="relative aspect-square bg-gray-50 rounded-xs overflow-hidden">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}