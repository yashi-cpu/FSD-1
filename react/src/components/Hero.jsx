import React from 'react';
import CanvasBackground from './CanvasBackground';
import Navbar from './Navbar';

export default function Hero({ currentUser, onOpenAuth, onLogout, onOpenReport }) {
  return (
    <section className="hero relative min-h-screen" id="home">
      {/* Background Frame with Canvas */}
      <div className="hero-frame">
        <CanvasBackground />
        <div className="noise"></div>
        <div className="vignette"></div>
      </div>

      {/* Hero Foreground Content */}
      <div className="content px-8 py-7 md:px-14 md:py-9">
        <Navbar
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onLogout={onLogout}
          onOpenReport={onOpenReport}
        />

        {/* LEFT HERO TEXT */}
        <div className="absolute left-8 md:left-20 top-[22%] sm:top-[25%] pointer-events-auto">
          <div className="eyebrow text-green-300/55 font-mono mb-4 md:mb-6">
            SECURECODE AI • AI-POWERED CODE SECURITY PLATFORM
          </div>

          <h1 className="main-title title-glow">
            Secure
            <br />
            <span className="outline-text">what </span>
            <span className="green">you</span>
            <br />
            <span className="outline-text">build.</span>
          </h1>

          <div className="mt-8 md:mt-10 flex items-center gap-6">
            <a
              href="#scanner"
              className="hero-button bg-white text-black rounded-full px-6 py-3.5 text-sm font-medium flex items-center gap-4 group"
            >
              <span>Upload & Analyze Project</span>
              <span className="button-arrow w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                ↗
              </span>
            </a>

            <span className="hidden sm:block text-xs text-white/40 max-w-[210px] leading-5 font-mono">
              Static AST checks + Scikit-learn Random Forest & Isolation Forest code intelligence.
            </span>
          </div>
        </div>

        {/* RIGHT HERO TEXT */}
        <div className="absolute right-8 md:right-20 top-[40%] md:top-[39%] w-64 md:w-80 pointer-events-auto hidden sm:block">
          <div className="text-4xl md:text-8xl font-light tracking-[-.07em] leading-[.85]">
            Code
            <br />
            <span className="green">under</span>
            <br />
            control.
          </div>

          <p className="mt-6 md:mt-8 text-sm md:text-base text-white/40 leading-6">
            Detect vulnerabilities, exposed credentials, vulnerable dependencies, and trace source-to-sink attack paths before deployment.
          </p>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-9 left-8 md:left-14 flex items-center gap-4">
          <div className="scroll-line"></div>
          <div className="text-[10px] text-white/35 tracking-[.15em] font-mono">
            SCROLL TO EXPLORE
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="status absolute bottom-9 right-8 md:right-14 rounded-full px-5 py-3 flex items-center gap-3">
          <span className="status-light"></span>
          <span className="text-[10px] font-mono text-white/45">
            ML DETECTION ENGINE ACTIVE
          </span>
        </div>

        {/* SCANNER LABEL */}
        <div className="absolute top-[18%] left-[50%] md:left-[51%] text-[9px] text-green-300/20 font-mono scanner-label pointer-events-none hidden md:block">
          AI INTELLIGENCE ONLINE...
        </div>
      </div>
    </section>
  );
}
