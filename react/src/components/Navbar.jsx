import React from 'react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, onOpenReport }) {
  return (
    <header className="flex items-center justify-between relative z-20 w-full">
      {/* Brand Logo & Author */}
      <a href="#home" className="flex items-center gap-3 group">
        <div className="logo-mark group-hover:scale-105 transition-transform duration-300"></div>
        <div>
          <div className="text-xl tracking-[-.05em] font-medium">
            SOC<span className="green">-AI</span>
          </div>
          <div className="text-[9px] tracking-[.25em] text-white/40">
            INTELLIGENT CODE SECURITY • <span className="text-[#7cff9b]">YASHI GOEL</span>
          </div>
        </div>
      </a>

      {/* Nav Links */}
      <nav className="nav hidden xl:flex items-center gap-6 rounded-full px-7 py-3 text-xs text-white/50 font-mono">
        <a className="nav-link hover:text-white" href="#dashboard">
          Dashboard
        </a>
        <a className="nav-link hover:text-white" href="#scanner">
          Scanner
        </a>
        <a className="nav-link hover:text-white" href="#vulnerabilities">
          Findings
        </a>
        <a className="nav-link hover:text-white" href="#secrets">
          Secrets
        </a>
        <a className="nav-link hover:text-white" href="#dependencies">
          Dependencies
        </a>
        <a className="nav-link hover:text-white" href="#attack-paths">
          Attack-Paths
        </a>
        <a className="nav-link hover:text-white" href="#ml-intelligence">
          ML-Engine
        </a>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Report Button */}
        <button
          onClick={onOpenReport}
          type="button"
          className="nav rounded-full px-4 py-2.5 text-xs font-mono text-[#7cff9b] border border-green-400/20 hover:border-green-400/50 hover:bg-green-500/10 transition-all flex items-center gap-1.5"
        >
          <span>📄</span>
          <span className="hidden sm:inline">REPORT</span>
        </button>

        {currentUser ? (
          <div className="nav rounded-full px-4 py-2 text-xs flex items-center gap-3 text-green-300 font-mono">
            <span className="max-w-[120px] truncate">{currentUser.name || currentUser.email}</span>
            <button
              onClick={onLogout}
              type="button"
              className="text-white/40 hover:text-red-400 text-xs transition-colors"
              title="Sign out"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            type="button"
            className="nav rounded-full px-4 py-2.5 text-xs flex items-center gap-2 text-white/80 hover:text-white transition-all font-mono"
          >
            <span>Sign In</span>
          </button>
        )}

        <a
          href="#scanner"
          className="nav rounded-full px-4 py-2.5 text-xs flex items-center gap-2 hover:text-white transition-all group font-mono"
        >
          <span className="hidden sm:inline">Scan Code</span>
          <span className="w-6 h-6 rounded-full bg-[#7cff9b] text-black flex items-center justify-center font-bold text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            ↗
          </span>
        </a>
      </div>
    </header>
  );
}
