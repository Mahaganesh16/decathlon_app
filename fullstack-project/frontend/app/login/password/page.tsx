'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOwnerId, mergeGuestCart } from '../../lib/cart';
import { mergeGuestWishlist } from '../../lib/wishlist';

function LoginPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    // Capture the guest id BEFORE we overwrite localStorage with the
    // logged-in user, so we know what to merge into their account.
    const guestOwnerId = getOwnerId();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Now that localStorage has the logged-in user, getOwnerId() returns
      // "user-<id>". Move anything saved as a guest onto this account.
      const userOwnerId = `user-${data.user.id}`;
      await Promise.all([
        mergeGuestCart(guestOwnerId, userOwnerId),
        mergeGuestWishlist(guestOwnerId, userOwnerId),
      ]);

      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Could not reach the server. Is the backend running on port 5000?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[600px] mx-auto px-4 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-800 font-medium mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l7.5-7.5M3 12l7.5 7.5M3 12h18" />
          </svg>
          Back
        </button>

        <div className="flex justify-center mb-10">
          <div className="text-3xl font-black uppercase text-[#007dba] tracking-tighter italic select-none">
            DECATHLON
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-950 mb-2 tracking-tight">Enter your password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Signing in as <span className="font-semibold text-gray-950">{email}</span>
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] focus:ring-4 focus:ring-[#007dba]/15 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2b4cc4] hover:bg-[#233f9e] disabled:opacity-60 text-white font-bold uppercase text-sm rounded-lg py-3.5 transition-colors cursor-pointer tracking-wider shadow-sm"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPasswordPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#007dba] border-t-transparent"></div>
      </div>
    }>
      <LoginPasswordContent />
    </React.Suspense>
  );
}