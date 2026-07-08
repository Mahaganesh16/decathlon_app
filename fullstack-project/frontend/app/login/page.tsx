'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'email' && !email) {
      setError('Please enter an email address.');
      return;
    }
    if (tab === 'phone' && !phone) {
      setError('Please enter a mobile phone number.');
      return;
    }

    setLoading(true);
    // Next screen would ask for the password / OTP.
    // For now this just moves to your password step — wire this up
    // to /api/auth/login once you add the password field.
    router.push(`/login/password?email=${encodeURIComponent(email)}`);
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

        <h1 className="text-3xl font-bold mb-6">Login</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setTab('email')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
              tab === 'email'
                ? 'border-[#2b4cc4] text-gray-900'
                : 'border-transparent text-gray-400'
            }`}
          >
            E-mail
          </button>
          <button
            type="button"
            onClick={() => setTab('phone')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
              tab === 'phone'
                ? 'border-[#2b4cc4] text-gray-900'
                : 'border-transparent text-gray-400'
            }`}
          >
            Phone number
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xs bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-5">
          {tab === 'email' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Enter an email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-xs px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] transition-colors"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile phone number
              </label>
              <div className="flex gap-3">
                <div className="flex items-center gap-1 border border-gray-300 rounded-xs px-3 py-3 text-sm">
                  🇮🇳 <span>+91</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile phone number"
                  className="flex-1 border border-gray-300 rounded-xs px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2b4cc4] hover:bg-[#233f9e] disabled:opacity-60 text-white font-bold uppercase text-sm rounded-xs py-3 transition-colors"
          >
            {loading ? 'Please wait...' : 'Next'}
          </button>
        </form>

        {/* Social logins */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xs py-3 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xs py-3 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            <FacebookIcon />
            Continue with Facebook
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xs py-3 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            <AppleIcon />
            Continue with Apple
          </button>
        </div>

        {/* Create account */}
        <div className="mt-10">
          <h2 className="font-bold text-gray-900 mb-1">No account ? Create one !</h2>
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-[#2b4cc4] font-bold hover:underline"
          >
            Create your DECATHLON account
          </button>
        </div>

        {/* Benefits list */}
        <div className="mt-10 pb-16">
          <h2 className="font-bold text-gray-900 mb-4">It's better when you're signed in</h2>
          <ul className="space-y-3 text-sm text-gray-800">
            <li className="flex items-center gap-2">
              <CheckIcon /> Exclusive Deals and Sporty Rewards
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon /> Personalised Experiences
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon /> Faster Checkout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.324v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-900 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}