import React from 'react';

export default function Footer() {
  return (
    <footer className="px-8 md:px-20 py-9 border-t border-white/5 relative z-10 bg-[#020503]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/25">
        <span>SOC-AI © 2026</span>
        <span className="tracking-widest">INTELLIGENT CODE SECURITY</span>
      </div>
    </footer>
  );
}

