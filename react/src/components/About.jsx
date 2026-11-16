import React from 'react';

export default function About() {
  return (
    <section id="about" className="section py-32 px-8 md:px-20 border-t border-green-400/5 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
        <div>
          <div className="eyebrow text-green-300/50 mb-7 font-mono">
            03 / SOC-AI
          </div>

          <h2 className="text-6xl md:text-8xl font-light tracking-[-.07em] leading-[.88]">
            Build
            <br />
            without
            <br />
            <span className="green">blind spots.</span>
          </h2>
        </div>

        <div className="flex items-center">
          <p className="text-base text-white/40 leading-8 max-w-lg">
            SOC-AI combines a modern web interface with automated source-code analysis and AI/ML-based
            security detection. The platform is designed to make security analysis easier to access for
            developers and students.
          </p>
        </div>
      </div>
    </section>
  );
}

