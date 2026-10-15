'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStoredUser, logout, AuthUser } from '../lib/auth';
import SearchBar from './SearchBar';

interface AlertBanner {
  text: string;
  linkText: string;
  email: string;
}

interface HeaderProps {
  banner?: AlertBanner | null;
  wishlistCount: number;
  cartCount: number;
}

export default function Header({ banner, wishlistCount, cartCount }: HeaderProps) {
  const router = useRouter();
  const [noticeSlides, setNoticeSlides] = useState<{ text: string; bgClass: string; isLink?: boolean }[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fadeToggle, setFadeToggle] = useState(true);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const slidesArray = [];
    if (banner?.text) {
      slidesArray.push({ text: banner.text, bgClass: 'bg-[#ef3340]', isLink: true });
    } else {
      slidesArray.push({
        text: 'Notice! | Product Recall | Horse Riding Helmet 100 Fouganza | Contact us! on customer care: 7676798989 or care.india@decathlon.com',
        bgClass: 'bg-[#ef3340]',
        isLink: true,
      });
    }
    slidesArray.push({
      text: 'App-Exclusive: Your welcome offer awaits. Download the app now!',
      bgClass: 'bg-[#2b4cc4]',
      isLink: false,
    });
    setNoticeSlides(slidesArray);
  }, [banner]);

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

  const activeNotice = noticeSlides[currentSlideIndex] || { text: '', bgClass: 'bg-[#ef3340]', isLink: false };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAccountMenuOpen(false);
    router.push('/');
  };

  const handleMenuClick = (href: string) => {
    setAccountMenuOpen(false);
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(href);
  };

  const accountMenuItems = [
    { key: 'profile', label: 'My Profile', icon: <ProfileMenuIcon />, href: '/account/profile' },
    { key: 'orders', label: 'Orders & Returns', icon: <OrdersMenuIcon />, href: '/account' },
    { key: 'wallet', label: 'Wallet', icon: <WalletMenuIcon />, href: '/account/wallet' },
    { key: 'rewards', label: 'Sporty Rewards', icon: <RewardsMenuIcon />, href: '/account/rewards' },
    { key: 'address', label: 'My Addresses', icon: <AddressMenuIcon />, href: '/account/address' },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <header className="relative z-[60] max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <div className="text-3xl font-black uppercase text-[#007dba] tracking-tighter cursor-pointer italic select-none">
          DECATHLON
        </div>

        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-6 text-[11px] text-gray-800">
          {/* ACCOUNT — hover to reveal dropdown. Nothing else renders below the icon/label. */}
          <div
            className="relative z-[100]"
            onMouseEnter={() => setAccountMenuOpen(true)}
            onMouseLeave={() => setAccountMenuOpen(false)}
          >
            <button
              type="button"
              className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>{user ? `Hi, ${user.name.split(' ')[0]}` : 'Account'}</span>
            </button>

            {accountMenuOpen && (
              <ul className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 text-[15px] text-gray-900 normal-case font-normal">
                {accountMenuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => handleMenuClick(item.href)}
                      className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={user ? handleLogout : () => handleMenuClick('/login')}
                    className="w-full flex items-center gap-4 px-6 py-3 text-red-600 hover:bg-gray-50 transition-colors text-left"
                  >
                    <LogoutMenuIcon />
                    {user ? 'Logout' : 'Login'}
                  </button>
                </li>
              </ul>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
            <span>My Store</span>
          </div>

          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25h.007v.008H12v-.008Z" />
            </svg>
            <span>Support</span>
          </div>

          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#ef3340] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#007dba] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
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
                {activeNotice.isLink && banner ? (
                  <>
                    Notice! | Product Recall | Horse Riding Helmet 100 Fouganza | Contact us! on customer care: 7676798989 or{' '}
                    <a href={`mailto:${banner.email}`} className="underline hover:text-yellow-200 font-extrabold transition-colors">
                      {banner.linkText}
                    </a>
                  </>
                ) : (
                  <>
                    App-Exclusive: Your welcome offer awaits.{' '}
                    <span className="underline font-extrabold cursor-pointer">Download the app now!</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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