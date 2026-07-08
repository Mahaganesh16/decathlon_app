'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';
import { getStoredUser, logout, AuthUser } from './lib/auth';
import { addToCart, fetchCart } from './lib/cart';
import { addToWishlist, removeFromWishlist, fetchWishlist } from './lib/wishlist';

interface AlertBanner {
  text: string;
  linkText: string;
  email: string;
}

interface Coupon {
  id: number;
  code: string;
  discount: string;
  minPurchase: string;
  bgColor: string;
}

interface QuickLink {
  id: number;
  title: string;
  imageUrl: string;
}

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

interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  priceTag: string;
  imageUrl: string;
  buttonLink: string;
}

interface AfterSalesService {
  id: number;
  title: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  sortOrder: number;
}

interface LayoutData {
  banner?: AlertBanner | null;
  coupons?: Coupon[];
  quickLinks?: QuickLink[];
  products?: Product[];
  heroBanners?: HeroBanner[];
  services?: AfterSalesService[];
}

export default function DecathlonHomepageUI() {
  const router = useRouter();
  const [data, setData] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const [noticeSlides, setNoticeSlides] = useState<{ text: string; bgClass: string; isLink?: boolean }[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fadeToggle, setFadeToggle] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
  const [wishlistBusyId, setWishlistBusyId] = useState<number | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    refreshCartCount();
    refreshWishlist();
  }, []);

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
      setWishlistedIds(new Set(wishlist.items.map((i) => i.productId)));
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  };

  const handleAddToCart = async (productId: number) => {
    setAddingProductId(productId);
    try {
      await addToCart(productId, 1);
      await refreshCartCount();
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      alert('Could not add item to cart. Please try again.');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleToggleWishlist = async (productId: number) => {
    setWishlistBusyId(productId);
    const alreadySaved = wishlistedIds.has(productId);
    try {
      if (alreadySaved) {
        await removeFromWishlist(productId);
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await addToWishlist(productId);
        setWishlistedIds((prev) => new Set(prev).add(productId));
      }
    } catch (err) {
      console.error('Failed to update wishlist:', err);
      alert('Could not update wishlist. Please try again.');
    } finally {
      setWishlistBusyId(null);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAccountMenuOpen(false);
    router.push('/');
  };

  const accountMenuItems = [
    { key: 'profile', label: 'My Profile', icon: <ProfileMenuIcon />, href: '/account?tab=profile' },
    { key: 'orders', label: 'Orders & Returns', icon: <OrdersMenuIcon />, href: '/account?tab=orders' },
    { key: 'wallet', label: 'Wallet', icon: <WalletMenuIcon />, href: '/account?tab=wallet' },
    { key: 'rewards', label: 'Sporty Rewards', icon: <RewardsMenuIcon />, href: '/account?tab=rewards' },
    { key: 'address', label: 'My Addresses', icon: <AddressMenuIcon />, href: '/account?tab=address' },
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/layout')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);

        const slidesArray = [];
        if (resData?.banner?.text) {
          slidesArray.push({
            text: `${resData.banner.text}`,
            bgClass: "bg-[#ef3340]",
            isLink: true
          });
        }
        
        slidesArray.push({
          text: "App-Exclusive: Your welcome offer awaits. Download the app now!",
          bgClass: "bg-[#2b4cc4]",
          isLink: false
        });

        setNoticeSlides(slidesArray);
      })
      .catch((err) => {
        console.error("API Layout connection exception:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (noticeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setFadeToggle(false);
      setTimeout(() => {
        setCurrentSlideIndex((prevIdx) => (prevIdx + 1) % noticeSlides.length);
        setFadeToggle(true);
      }, 350);
    }, 4000);
    return () => clearInterval(interval);
  }, [noticeSlides]);

  useEffect(() => {
    if (!data?.heroBanners || data.heroBanners.length <= 1) return;
    const sliderInterval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % (data.heroBanners?.length || 1));
    }, 4000);
    return () => clearInterval(sliderInterval);
  }, [data]);

  const handleSideScroll = (categoryKey: string, direction: 'left' | 'right') => {
    const trackElement = document.getElementById(`scroll-track-${categoryKey}`);
    if (!trackElement) return;

    const scrollAmount = 345; 
    const currentOffset = trackElement.scrollLeft;
    const newOffset = direction === 'left' ? currentOffset - scrollAmount : currentOffset + scrollAmount;
    
    trackElement.scrollTo({
      left: newOffset,
      behavior: 'smooth'
    });
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#007dba]">
        <div className="text-center text-white flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
          <h2 className="text-lg font-black tracking-widest uppercase italic select-none">DECATHLON</h2>
        </div>
      </div>
    );
  }

  const activeCoupons = data.coupons || [];
  const activeQuickLinks = data.quickLinks || [];
  const productsListArray = data.products || [];
  const activeServices = data.services || [];
  const activeHeros = data.heroBanners || [];

  const groupedProducts = productsListArray.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  const activeNotice = noticeSlides[currentSlideIndex] || { text: '', bgClass: 'bg-[#ef3340]', isLink: false };

  return (
    <div className="bg-white text-black antialiased min-h-screen w-full relative overflow-y-auto overflow-x-hidden font-sans selection:bg-blue-200 flex flex-col justify-between">
      
      <div>
        {/* 1. STICKY NAVBAR HEADER */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
          <header className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between gap-6">
            <div className="text-3xl font-black uppercase text-[#007dba] tracking-tighter cursor-pointer italic select-none">
              DECATHLON
            </div>
            
            <div className="flex-1 max-w-2xl relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5-12m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder='Search for "Football"|' 
                className="w-full bg-[#f2f2f2] rounded-xs text-sm pl-9 pr-4 py-2 focus:outline-none border border-transparent focus:border-gray-300 transition-all font-medium" 
              />
            </div>
            
            <div className="flex items-center gap-6 font-medium text-[11px] text-gray-800">
              {user ? (
                <div
                  className="relative z-[100] pb-3 -mb-3"
                  onMouseEnter={() => setAccountMenuOpen(true)}
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  <button type="button" className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
                    <AccountIcon />
                    <span className="uppercase font-bold tracking-tight">Hi, {user.name.split(' ')[0]}</span>
                  </button>

                  {accountMenuOpen && (
                    <ul className="absolute right-0 top-full w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 text-[15px] text-gray-900 normal-case font-normal">
                      {accountMenuItems.map((item) => (
                        <li key={item.key}>
                          <Link
                            href={item.href}
                            onClick={() => setAccountMenuOpen(false)}
                            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-4 px-6 py-3 text-red-600 hover:bg-gray-50 transition-colors text-left"
                        >
                          <LogoutMenuIcon />
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
                  <AccountIcon />
                  <span className="uppercase font-bold tracking-tight">Sign In</span>
                </Link>
              )}
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
                <StoreIcon />
                <span className="uppercase font-bold tracking-tight">My Store</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
                <SupportIcon />
                <span className="uppercase font-bold tracking-tight">Support</span>
              </div>
              <div
                onClick={() => router.push('/wishlist')}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 relative"
              >
                <HeartIcon />
                <span className="uppercase font-bold tracking-tight">Wishlist</span>
                {wishlistedIds.size > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[#ef3340] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistedIds.size}
                  </span>
                )}
              </div>
              <div
                onClick={() => router.push('/cart')}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 relative"
              >
                <CartIcon />
                <span className="uppercase font-bold tracking-tight">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[#007dba] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </header>

          <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center text-xs font-bold text-gray-800 gap-8">
            <span className="cursor-pointer hover:text-blue-600">All Sports</span>
            <span className="cursor-pointer hover:text-blue-600">Men</span>
            <span className="cursor-pointer hover:text-blue-600">Women</span>
            <span className="cursor-pointer hover:text-blue-600">Kids</span>
          </div>

          {noticeSlides.length > 0 && (
            <div className="max-w-[1400px] mx-auto px-4 pb-2">
              <div className={`${activeNotice.bgClass} text-white rounded-xs transition-colors duration-500 shadow-xs`}>
                <div className="w-full h-9 flex items-center justify-center overflow-hidden px-4 relative">
                  <div 
                    key={currentSlideIndex}
                    className={`text-[12px] font-black tracking-wide text-center transition-all duration-300 ease-in-out ${
                      fadeToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    {activeNotice.isLink && data?.banner ? (
                      <>
                        {data.banner.text}{' '}
                        <a href={`mailto:${data.banner.email}`} className="underline hover:text-yellow-200 font-extrabold transition-colors">
                          {data.banner.linkText}
                        </a>
                      </>
                    ) : (
                      <>
                        {activeNotice.text}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Layout Body Area */}
        <main className="max-w-[1400px] mx-auto px-4 py-4 block relative clear-both">
          
          {/* 2. DYNAMIC COUPON VOUCHER STRIP */}
          {activeCoupons.length > 0 && (
            <div className="relative w-full rounded-xs overflow-hidden flex flex-col xl:flex-row items-stretch min-h-[160px] border border-gray-200 bg-slate-50 shadow-xs mb-6">
              <div className="relative bg-white w-full xl:w-[35%] p-5 flex items-center justify-between z-10">
                <div className="flex flex-col text-left pr-4">
                  <h2 className="text-[23px] font-black tracking-tight text-gray-950 leading-tight uppercase font-sans italic">
                    Get your <br/>first-order <br/>coupon!
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 font-bold tracking-tight">Scan to download app now.</p>
                </div>
                <div className="w-20 h-20 bg-white p-1 border border-blue-600 rounded-sm flex-shrink-0 flex items-center justify-center xl:mr-10 z-10">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://decathlon.in" alt="QR" className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-0 bottom-0 -right-7 w-8 bg-white origin-top-left skew-x-[-14deg] hidden xl:block z-0 border-r border-gray-100"></div>
              </div>

              <div className="w-full xl:w-[65%] p-4 grid grid-cols-1 md:grid-cols-3 gap-3.5 items-center z-10">
                {activeCoupons.map((coupon) => (
                  <div key={coupon.id} className="bg-[#2b4cc4] rounded-lg shadow-sm flex items-stretch h-[115px] relative overflow-hidden border border-[#2343b6]">
                    <div className="bg-[#1f3ba3] text-white w-9 flex items-center justify-center font-black text-[10px] uppercase tracking-wider select-none [writing-mode:vertical-lr] rotate-180 border-r border-dashed border-white/20">
                      {coupon.code}
                    </div>
                    <div className="flex-1 m-1 rounded-md p-2 flex flex-col justify-between items-center text-center bg-white">
                      <div className="text-[9px] font-black text-gray-400 self-start uppercase">Upto</div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-blue-700 tracking-tight leading-none uppercase">{coupon.discount}</span>
                        <span className="text-[10px] font-extrabold text-gray-800 mt-0.5">On purchase <span className="text-blue-600 font-black">{coupon.minPurchase}</span></span>
                      </div>
                      <div className="bg-[#2b4cc4] text-white font-black text-[9px] py-1 rounded-sm uppercase tracking-wider w-full shadow-xs cursor-pointer leading-none">
                        Use Code - {coupon.code}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. DYNAMIC QUICK LINKS NAVIGATION ITEMS */}
          {activeQuickLinks.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 pb-4 pt-1 border-b border-gray-100 mb-6">
              {activeQuickLinks.map((link) => (
                <div key={link.id} className="relative aspect-square w-full overflow-hidden group cursor-pointer border border-gray-100 shadow-xs rounded-xs bg-gray-50">
                  <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-3 left-2 right-2 z-20 text-center">
                    <span className="text-sm font-bold text-white tracking-tight block">{link.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. DYNAMIC HERO SLIDER BANNERS */}
          {activeHeros.length > 0 && (
            <div className="relative w-full rounded-xs overflow-hidden h-[340px] md:h-[400px] lg:h-[460px] shadow-xs border border-gray-100 mb-12 bg-gray-900 group select-none">
              <div 
                className="flex h-full w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentHeroIndex * 100}%)` }}
              >
                {activeHeros.map((slide) => (
                  <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover absolute inset-0 z-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent z-10" />
                    <div className="absolute inset-y-0 left-8 md:left-16 flex flex-col justify-center text-white z-20 max-w-md md:max-w-xl">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase italic leading-none drop-shadow-xs">
                        {slide.title}
                      </h1>
                      <p className="text-base md:text-lg lg:text-xl font-bold text-gray-200 mt-2 tracking-tight">
                        {slide.subtitle}
                      </p>
                      <div className="text-2xl md:text-3xl font-black text-yellow-400 mt-3 tracking-tighter">
                        {slide.priceTag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SECTIONS DYNAMIC ROW SPREADS */}
          {Object.entries(groupedProducts).map(([categoryName, productsList]) => {
            const categoryKey = categoryName.replace(/\s+/g, '-').toLowerCase();

            return (
              <React.Fragment key={categoryName}>
                <div className="flex flex-col lg:flex-row items-stretch w-full gap-4 mb-14 border-b pb-8 last:border-0">
                  <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col justify-between py-2 text-left bg-white select-none">
                    <div>
                      <span className="text-gray-400 font-extrabold text-xs uppercase block">Shop your</span>
                      <h3 className="text-[32px] font-black text-gray-950 tracking-tight uppercase leading-9 italic">{categoryName}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-6 lg:mt-0">
                      <button onClick={() => handleSideScroll(categoryKey, 'left')} className="w-10 h-10 rounded-full border text-sm font-black">❮</button>
                      <button onClick={() => handleSideScroll(categoryKey, 'right')} className="w-10 h-10 rounded-full border text-sm font-black">❯</button>
                    </div>
                  </div>

                  <div className="flex-1 relative overflow-x-auto min-h-[430px]">
                    <div id={`scroll-track-${categoryKey}`} className="flex flex-row items-stretch gap-4 overflow-x-auto scroll-smooth pb-4 w-full h-full scrollbar-none">
                      {productsList.map((product) => {
                        const filledStars = Math.round(product.rating);
                        return (
                          <div key={product.id} className="w-[230px] flex-shrink-0 flex flex-col justify-between bg-white relative p-1.5 rounded-sm">
                            <Link href={`/product/${product.id}`} className="w-full text-left block">
                              <div className="relative w-full aspect-square bg-[#fdfdfd] flex items-center justify-center overflow-hidden rounded-xs mb-3">
                                <img 
                                  src={(product.imageUrl && product.imageUrl.trim() !== "") ? product.imageUrl : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1593&auto=format&fit=crop"} 
                                  alt={product.name} 
                                  className="object-cover w-full h-full mix-blend-multiply" 
                                  onError={(e) => {
                                    e.currentTarget.onerror = null; 
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1593&auto=format&fit=crop";
                                  }}
                                />
                              </div>
                              <h4 className="text-[13px] leading-tight">
                                <span className="font-black text-gray-900">{product.brand}</span>{' '}
                                <span className="font-medium text-gray-800 line-clamp-2">{product.name}</span>
                              </h4>

                              <div className="flex items-center gap-1.5 mt-1.5">
                                <div className="flex text-amber-500 text-xs leading-none tracking-tighter">
                                  {'★'.repeat(filledStars)}
                                  <span className="text-gray-300">{'★'.repeat(5 - filledStars)}</span>
                                </div>
                                <span className="text-[11px] text-gray-500 font-semibold">{product.reviews}</span>
                              </div>

                              <div className="mt-1.5">
                                <span className="text-[17px] font-black text-gray-950">₹{product.price}</span>
                                {product.mrp && product.mrp > product.price && (
                                  <div className="text-[11px] text-gray-400 line-through">
                                    MRP ₹{product.mrp.toLocaleString('en-IN')}
                                  </div>
                                )}
                              </div>

                              {product.discountTag && (
                                <div className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-sm mt-2 leading-tight">
                                  {product.discountTag}
                                </div>
                              )}
                            </Link>

                            <div className="w-full mt-2 flex items-center gap-2">
                              <button
                                onClick={() => handleToggleWishlist(product.id)}
                                disabled={wishlistBusyId === product.id}
                                aria-label="Add to wishlist"
                                className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xs border transition-colors disabled:opacity-50 ${
                                  wishlistedIds.has(product.id)
                                    ? 'border-[#ef3340] text-[#ef3340]'
                                    : 'border-gray-300 hover:border-gray-950 text-gray-700 hover:text-black'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill={wishlistedIds.has(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleAddToCart(product.id)}
                                disabled={addingProductId === product.id}
                                className="flex-1 bg-white border border-gray-950 text-black text-[11px] font-black py-2 rounded-xs hover:bg-gray-950 hover:text-white transition-all uppercase h-9 disabled:opacity-50"
                              >
                                {addingProductId === product.id ? 'Adding...' : 'Add to cart'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AFTER SALES SERVICES - injected right after "STORM PROOF." row, before "Shop your Workout Checklist" */}
                {categoryName === 'STORM PROOF.' && activeServices.length > 0 && (
                  <section className="mb-16">
                    <h2 className="text-lg font-black text-gray-950 mb-5">After Sales Services</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      {activeServices.map((service) => (
                        <div key={service.id} className="flex flex-col">
                          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-900">
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            <div className="absolute bottom-8 left-4 right-4">
                              <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                                {service.title}
                              </h3>
                            </div>
                          </div>

                          <button
                            onClick={() => window.location.href = service.buttonLink}
                            className="relative -mt-6 mx-auto z-10 bg-[#3643ba] hover:bg-[#2d38a0] text-white text-xs font-bold uppercase tracking-wide px-6 py-2.5 rounded-full shadow-md transition-colors whitespace-nowrap"
                          >
                            {service.buttonText}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </React.Fragment>
            );
          })}

        </main>
      </div>

      {/* 7. FOOTER COMPONENT */}
      <Footer />

    </div>
  );
}

/* ---------------- HEADER ICONS ---------------- */

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

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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

/* ---------------- ACCOUNT DROPDOWN ICONS ---------------- */

function ProfileMenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function OrdersMenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.885-4.665 2.235-6.75H4.5M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

function WalletMenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-19.5 0v6a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25v-6m-19.5 0a2.25 2.25 0 0 1 2.25-2.25h5.379a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H19.5a2.25 2.25 0 0 1 2.25 2.25" />
    </svg>
  );
}

function RewardsMenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function AddressMenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function LogoutMenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
    </svg>
  );
}