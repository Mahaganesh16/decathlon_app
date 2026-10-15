'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Account created successfully — do NOT auto-login.
      // Send the user to the login page so they sign in with their new credentials.
      router.push('/login?registered=1');
    } catch (err) {
      console.error(err);
      setError('Could not reach the server. Is the backend running on port 5000?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-4 pt-10">
      <Link
        href="/"
        className="text-3xl font-black uppercase text-[#007dba] tracking-tighter italic select-none mb-10"
      >
        DECATHLON
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-950 mb-6 tracking-tight">Create your account</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] focus:ring-4 focus:ring-[#007dba]/15 transition-all font-medium"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] focus:ring-4 focus:ring-[#007dba]/15 transition-all font-medium"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] focus:ring-4 focus:ring-[#007dba]/15 transition-all font-medium"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007dba] focus:ring-4 focus:ring-[#007dba]/15 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007dba] hover:bg-[#00699b] disabled:opacity-60 text-white font-bold uppercase text-sm rounded-lg py-3.5 transition-colors cursor-pointer tracking-wider shadow-sm mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-700">
          Already have an account?{' '}
          <Link href="/login" className="text-[#007dba] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}