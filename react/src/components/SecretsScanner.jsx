import React, { useState } from 'react';

export default function SecretsScanner({ secrets = [], showToast }) {
  const [unmaskId, setUnmaskId] = useState(null);

  const toggleReveal = (id) => {
    if (unmaskId === id) {
      setUnmaskId(null);
    } else {
      setUnmaskId(id);
      if (showToast) {
        showToast('⚠️ Security Notice', 'Temporarily revealing sensitive credential on screen.', 2000);
      }
    }
  };

  return (
    <section id="secrets" className="section py-24 px-8 md:px-20 border-t border-green-400/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="eyebrow text-green-300/50 mb-3 font-mono">
            03 / EXPOSED CREDENTIALS & HARDCODED SECRETS
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-[-.05em]">
            Secret <span className="green">Detection</span> Engine
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-xl leading-relaxed">
            Identifies API keys, private tokens, database credentials, and certificates using
            regex pattern signatures and Shannon entropy signals. Values are masked by default.
          </p>
        </div>

        {/* SECRETS LIST */}
        <div className="space-y-4">
          {secrets.map((sec, idx) => {
            const isRevealed = unmaskId === sec.id;
            return (
              <div
                key={sec.id || idx}
                className="feature-card rounded-[24px] p-6 border border-green-400/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-3 py-1 rounded-full border border-red-400/30 bg-red-400/10 text-red-300 font-semibold">
                      {sec.severity}
                    </span>
                    <span className="text-sm font-mono text-white/80 font-medium">
                      {sec.secret_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/40">
                    <span>File: <span className="text-white/70">{sec.file}</span></span>
                    <span>Line: <span className="text-white/70">{sec.line}</span></span>
                    <span>Shannon Entropy: <span className="text-[#7cff9b]">{sec.entropy_score} bits</span></span>
                  </div>

                  {sec.leak_context && (
                    <div className="bg-black/50 border border-green-400/10 rounded-xl px-4 py-2 text-xs font-mono text-white/60">
                      <code>{sec.leak_context}</code>
                    </div>
                  )}
                </div>

                {/* Masked Secret Box */}
                <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
                  <div className="bg-black/60 border border-green-400/20 rounded-xl px-4 py-2.5 font-mono text-xs text-yellow-300 tracking-wider">
                    {isRevealed
                      ? sec.leak_context?.split('=')[1]?.trim() || 'sk_test_mock_stripe_placeholder_key_demo'
                      : sec.masked_value}
                  </div>

                  <button
                    onClick={() => toggleReveal(sec.id)}
                    type="button"
                    className="text-xs font-mono px-3 py-2 rounded-xl border border-white/10 hover:border-green-400/30 text-white/50 hover:text-white transition-colors"
                  >
                    {isRevealed ? 'HIDE' : 'REVEAL'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

