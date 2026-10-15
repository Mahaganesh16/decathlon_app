'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '../lib/media';

interface ProductResult {
  id: number;
  brand: string;
  name: string;
  imageUrl: string;
  price: number;
  mrp: number;
  discountTag?: string | null;
  category: string;
}

const POPULAR_SUGGESTIONS = [
  { label: 'Football', icon: '⚽' },
  { label: 'Umbrella', icon: '☔' },
  { label: 'Raincoat', icon: '🌧️' },
  { label: 'Running Shoes', icon: '👟' },
  { label: 'Cycling', icon: '🚴' },
  { label: 'Fitness Equipments', icon: '🏋️' },
];

const PLACEHOLDER_TERMS = [
  'Football',
  'Umbrella',
  'Raincoat',
  'Running Shoes',
  'Cycling Gear',
  'Badminton',
  'Gym Wear',
];

export default function SearchBar({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic Typewriter Effect for placeholder
  useEffect(() => {
    // Only animate placeholder when search input is empty and not focused
    if (query) return;

    const currentTerm = PLACEHOLDER_TERMS[currentTermIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseDelay = isDeleting ? 300 : 1800;

    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedPlaceholder === currentTerm) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && displayedPlaceholder === '') {
      setIsDeleting(false);
      setCurrentTermIndex((prev) => (prev + 1) % PLACEHOLDER_TERMS.length);
    } else {
      timeout = setTimeout(() => {
        const nextText = isDeleting
          ? currentTerm.substring(0, displayedPlaceholder.length - 1)
          : currentTerm.substring(0, displayedPlaceholder.length + 1);
        setDisplayedPlaceholder(nextText);
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayedPlaceholder, isDeleting, currentTermIndex, query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        .then((res) => (res.ok ? res.json() : { products: [] }))
        .then((data) => {
          setResults(data.products || []);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSelectSuggestion = (term: string) => {
    setQuery(term);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && results.length > 0) {
      router.push(`/product/${results[0].id}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => {
            if (query.trim() && results.length > 0) {
              router.push(`/product/${results[0].id}`);
              setIsOpen(false);
            } else {
              inputRef.current?.focus();
            }
          }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#007dba] transition-colors flex items-center justify-center p-0.5 cursor-pointer z-10"
          title="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={`Search for "${displayedPlaceholder || 'Football'}"`}
          className="w-full bg-[#f2f2f2] hover:bg-[#ededed] focus:bg-white text-gray-900 rounded-full text-sm pl-11 pr-10 py-2.5 focus:outline-none border border-transparent focus:border-[#007dba] focus:ring-4 focus:ring-[#007dba]/15 transition-all font-medium placeholder:text-gray-400"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#007dba] border-t-transparent" />
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Suggestions / Live Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[150] transition-all">
          {/* STATE 1: Empty input -> Show Trending / Suggestions */}
          {!query.trim() && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                  <path fillRule="evenodd" d="M13.597 10.395a6.002 6.002 0 0 0-.847-1.464c-.382-.486-.8-.92-1.25-1.298-.445-.375-.92-.693-1.42-.947a.75.75 0 0 0-1.08 0c-.5.254-.975.572-1.42.947-.45.378-.868.812-1.25 1.298a6.002 6.002 0 0 0-.847 1.464c-.31.812-.468 1.67-.468 2.544 0 3.866 3.134 7 7 7s7-3.134 7-7c0-.874-.158-1.732-.468-2.544Zm-4.097 5.605a3 3 0 1 1 2-2.829c0 .77-.289 1.474-.766 2.008a.75.75 0 0 1-1.234-.821c.214-.24.34-.55.34-.887 0-.966-.784-1.75-1.75-1.75s-1.75.784-1.75 1.75a1.75 1.75 0 0 0 3.16.929Z" clipRule="evenodd" />
                </svg>
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    onClick={() => handleSelectSuggestion(sug.label)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#007dba] border border-gray-200/80 hover:border-[#007dba]/40 rounded-full text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span>{sug.icon}</span>
                    <span>{sug.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STATE 2: Typing query -> Show Results */}
          {query.trim() && (
            <div>
              {loading && results.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-[#007dba] border-t-transparent mb-2" />
                  <div>Searching products...</div>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="px-4 py-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span>Products matching &quot;{query}&quot;</span>
                    <span className="text-[#007dba] font-bold">{results.length} found</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3.5 p-3 hover:bg-blue-50/50 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black uppercase text-[#007dba] tracking-wider">
                              {product.brand}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium truncate">
                              • {product.category}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#007dba] transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-gray-950">
                              ₹{product.price}
                            </span>
                            {product.mrp > product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{product.mrp}
                              </span>
                            )}
                            {product.discountTag && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                                {product.discountTag}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-300 group-hover:text-[#007dba] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                /* STATE 3: No Results Found */
                <div className="py-10 px-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    No products found for &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Check your spelling or try searching for another term.
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {POPULAR_SUGGESTIONS.slice(0, 4).map((sug) => (
                      <button
                        key={sug.label}
                        type="button"
                        onClick={() => handleSelectSuggestion(sug.label)}
                        className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-[#007dba] hover:text-white rounded-full text-gray-700 transition-colors cursor-pointer"
                      >
                        {sug.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
