'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoredUser, logout, AuthUser } from '../lib/auth';

type TabKey = 'orders' | 'profile' | 'wallet' | 'rewards' | 'address';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [orderTab, setOrderTab] = useState<'online' | 'store'>('online');

  const activeTab = (searchParams.get('tab') as TabKey) || 'orders';

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(stored);
    setCheckedAuth(true);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!checkedAuth || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#007dba] border-t-transparent"></div>
      </div>
    );
  }

  const menuItems: { key: TabKey; label: string; icon: React.ReactNode; value?: string }[] = [
    { key: 'orders', label: 'My Orders', icon: <OrdersIcon /> },
    { key: 'profile', label: 'My Profile', icon: <ProfileIcon /> },
    { key: 'wallet', label: 'Wallet', icon: <WalletIcon />, value: '₹ 0' },
    { key: 'rewards', label: 'Sporty Rewards', icon: <RewardsIcon />, value: '0 pts' },
    { key: 'address', label: 'Address', icon: <AddressIcon /> },
  ];

  return (
    <div className="bg-[#f7f7f7] min-h-screen text-black antialiased font-sans">
      {/* NAVBAR */}
      <div className="bg-white border-b border-gray-200 shadow-xs">
        <header className="max-w-[1400px] mx-auto px-4 h-16 flex items-center gap-6">
          <button className="flex items-center gap-1.5 font-black text-sm uppercase tracking-tight text-gray-900 whitespace-nowrap">
            <MenuIcon />
            All<br />Sports
          </button>

          <Link href="/" className="text-3xl font-black uppercase text-[#007dba] tracking-tighter italic select-none whitespace-nowrap">
            DECATHLON
          </Link>

          <div className="flex-1 max-w-xl relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder='Search for "Yoga Mats"'
              className="w-full bg-[#f2f2f2] rounded-full text-sm pl-11 pr-4 py-2.5 focus:outline-none border border-transparent focus:border-gray-300 transition-all font-medium"
            />
          </div>

          <div className="hidden lg:block text-xs text-gray-800 whitespace-nowrap">
            <div className="font-medium">Delivery Location</div>
            <div>
              <span className="font-bold">560001</span>{' '}
              <span className="text-blue-700 font-bold cursor-pointer hover:underline">CHANGE</span>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-[11px] font-medium text-gray-800">
            <div className="flex flex-col items-center gap-1 text-[#007dba]">
              <AccountIcon />
              <span>Account</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
              <StoreIcon />
              <span>My Store</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
              <SupportIcon />
              <span>Support</span>
            </div>
            <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600">
              <HeartIcon />
              <span>Wishlist</span>
            </Link>
            <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 relative">
              <CartIcon />
              <span>Cart</span>
            </Link>
          </nav>
        </header>
      </div>

      {/* BODY */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* User card */}
          <div className="bg-[#2b4cc4] text-white rounded-sm px-6 py-6">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-blue-100 mt-1">{user.email}</p>
          </div>

          {/* Loyalty points card */}
          <div className="bg-white rounded-sm px-6 py-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Loyalty Points</h3>
              <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                0 pts <ChevronRightIcon />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Start shopping today to earn &amp; redeem points for direct savings on purchases!
            </p>
            <button className="w-full border border-gray-900 text-gray-900 font-bold text-sm uppercase tracking-wide py-3 mt-4 rounded-xs hover:bg-gray-900 hover:text-white transition-colors">
              Learn More
            </button>
          </div>

          {/* Menu */}
          <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={`/account?tab=${item.key}`}
                className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${
                  activeTab === item.key ? 'bg-[#eef1fb]' : ''
                }`}
              >
                <span className="flex items-center gap-3 font-semibold text-gray-900">
                  {item.icon}
                  {item.label}
                </span>
                {item.value && <span className="text-gray-700 font-medium">{item.value}</span>}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors text-left"
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          {activeTab === 'orders' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-black text-gray-950">Orders &amp; Returns</h1>

                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => setOrderTab('online')}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                        orderTab === 'online' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      Online Order
                    </button>
                    <button
                      onClick={() => setOrderTab('store')}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                        orderTab === 'store' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      Store Order
                    </button>
                  </div>

                  <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 text-sm font-bold text-gray-800">
                    <FilterIcon />
                    Last 1 month
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <EmptyBoxIcon />
                </div>
                <p className="text-gray-500 font-medium">No items are available</p>
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <h1 className="text-2xl font-black text-gray-950 mb-8">My Profile</h1>
              <div className="max-w-lg space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full border border-gray-300 rounded-xs px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 rounded-xs px-4 py-3 text-sm text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                  <input
                    type="tel"
                    placeholder="Add your phone number"
                    className="w-full border border-gray-300 rounded-xs px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] transition-colors"
                  />
                </div>
                <button className="bg-[#007dba] hover:bg-[#00699b] text-white font-bold uppercase text-sm rounded-xs px-6 py-3 transition-colors">
                  Save changes
                </button>
              </div>
            </>
          )}

          {activeTab === 'wallet' && (
            <>
              <h1 className="text-2xl font-black text-gray-950 mb-8">Wallet</h1>
              <div className="bg-[#2b4cc4] text-white rounded-lg px-6 py-6 max-w-md mb-8">
                <p className="text-sm text-blue-100">Available balance</p>
                <p className="text-3xl font-black mt-1">₹ 0</p>
              </div>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <EmptyBoxIcon />
                </div>
                <p className="text-gray-500 font-medium">No transactions yet</p>
              </div>
            </>
          )}

          {activeTab === 'rewards' && (
            <>
              <h1 className="text-2xl font-black text-gray-950 mb-8">Sporty Rewards</h1>
              <div className="bg-[#2b4cc4] text-white rounded-lg px-6 py-6 max-w-md mb-8">
                <p className="text-sm text-blue-100">Your points balance</p>
                <p className="text-3xl font-black mt-1">0 pts</p>
              </div>
              <p className="text-gray-600 text-sm">
                Earn points on every purchase and redeem them for discounts on future orders.
              </p>
            </>
          )}

          {activeTab === 'address' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black text-gray-950">My Addresses</h1>
                <button className="bg-[#007dba] hover:bg-[#00699b] text-white font-bold uppercase text-sm rounded-xs px-5 py-2.5 transition-colors">
                  + Add new address
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <EmptyBoxIcon />
                </div>
                <p className="text-gray-500 font-medium">You haven&apos;t saved any addresses yet</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5-12m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
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

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.964 0a9 9 0 1 0-11.964 0m11.964 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
  );
}

function RewardsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 -3h12m0 0-3-3m3 3-3 3" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 0-3 0m3 0a1.5 1.5 0 0 1-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function EmptyBoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-14 h-14 text-blue-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v1.5m18 0-8.716 5.814a2.25 2.25 0 0 1-2.568 0L3 7.5m18 0v10.5A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 1 3 18V7.5" />
    </svg>
  );
}