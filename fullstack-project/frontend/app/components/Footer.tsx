import React from 'react';

const featureStrip = [
  {
    label: 'Easy Returns*',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 11a8 8 0 1 1 2.6 5.9" />
        <path d="M3 6v5h5" />
      </svg>
    ),
  },
  {
    label: 'Collect in-store',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2.5" y="5" width="14" height="9.5" rx="1" />
        <path d="M16.5 8.5 21 7v7l-4.5-1.5" />
      </svg>
    ),
  },
  {
    label: 'Express Delivery *',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="6" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M8 17h6l2-6h-4l-1.5-3H6l1 3h2.5L11 15" />
      </svg>
    ),
  },
  {
    label: '1 Mn+ happy customers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
        <path d="M9 9.5h.01M15 9.5h.01" />
      </svg>
    ),
  },
  {
    label: 'We buy back',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 3 21 7l-4 4" />
        <path d="M21 7H9a5 5 0 0 0-5 5v1" />
        <path d="M7 21 3 17l4-4" />
        <path d="M3 17h12a5 5 0 0 0 5-5v-1" />
      </svg>
    ),
  },
];

const serviceLinks = [
  'Decathlon for Schools',
  'Decathlon for Corporates',
  'Decathlon for Sport Clubs',
  'Giftcard',
  'Affiliate Program',
  'Playo Summer',
  'Second life',
  'Buy back',
  'Installation & assembly',
];

const helpLinks = ['Find a store', 'Return Policy', 'Shipping policy', 'Sitemap'];
const aboutLinks = ['About us', 'Made In India', 'Social & CSR Initiatives', 'Careers', 'Blog'];

const socialLinks = [
  {
    name: 'Facebook',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.35C16.2 4.3 15.2 4.2 14 4.2c-2.4 0-4 1.45-4 4.1V10.5H7.5v3H10V21h3.5Z" />
      </svg>
    ),
  },
  {
    name: 'X',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.9 3H21l-6.4 7.3L22 21h-6.6l-5.2-6.8L4.2 21H2l6.9-7.8L2 3h6.7l4.7 6.2L18.9 3Zm-1.1 16h1.2L7.3 4.9H6L17.8 19Z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M10 8.6v6.8l6-3.4-6-3.4Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="16.6" cy="7.4" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#3643ba] text-white mt-14 w-full text-left">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-wrap items-center gap-x-12 gap-y-5 pt-9 pb-14 border-b border-white/10">
          {featureStrip.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="opacity-90">{item.icon}</span>
              <span className="text-[15px] font-bold whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr] gap-x-10 gap-y-10 py-16">
          <div className="flex flex-col">
            <a href="#" className="text-[17px] font-semibold mb-4 hover:underline">Download the app</a>
            <a href="#" className="text-[17px] font-semibold mb-7 hover:underline">Become a member</a>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-full border border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wide text-white/75 mb-5">Services</h4>
            <ul className="flex flex-col gap-4">
              {serviceLinks.map((l) => (
                <li key={l}><a href="#" className="text-[15px] hover:underline">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wide text-white/75 mb-5">Help</h4>
            <ul className="flex flex-col gap-4">
              {helpLinks.map((l) => (
                <li key={l}><a href="#" className="text-[15px] hover:underline">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wide text-white/75 mb-5">About</h4>
            <ul className="flex flex-col gap-4">
              {aboutLinks.map((l) => (
                <li key={l}><a href="#" className="text-[15px] hover:underline">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M11.8 2.2C9 4.6 4.5 9 4.5 14.2 4.5 18.6 8 22 12.3 22c-2.6-2-4.4-5-4.4-8.6 0-4.4 2.6-8 3.9-11.2Z" />
          </svg>
          <span className="text-[26px] font-black italic tracking-tight">DECATHLON</span>
        </div>
      </div>

      <div className="border-t border-white/20 bg-[#2b36a1]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-8">
              <a href="#" className="text-[13px] font-semibold hover:underline">Terms and Conditions</a>
              <a href="#" className="text-[13px] font-semibold hover:underline">Privacy Policy</a>
            </div>
            <button className="flex items-center gap-2 text-[13px] font-semibold self-start sm:self-auto">
              <span className="text-base leading-none">🇮🇳</span>
              <span>India</span>
            </button>
          </div>
          <div className="flex justify-end mt-3">
            <span className="text-[13px] text-white/80">
              © 2026 Decathlon Sports India Pvt Ltd. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}