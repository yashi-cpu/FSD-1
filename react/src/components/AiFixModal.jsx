import React, { useState, useEffect } from 'react';

export default function AiFixModal({ isOpen, threat, onClose, showToast }) {
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setCopied(false);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, threat]);

  if (!isOpen || !threat) return null;

  const isSample = threat === 'sample-threat';

  const title = isSample
    ? 'Sample: SQL Injection Remediation'
    : threat.title || threat.type || 'AI Security Remediation';

  const explanation = isSample
    ? 'This is a sample AI remediation demo. Connect your Python ML model backend or scan code to receive live fixes.'
    : threat.fix_explanation || threat.description || 'AI-generated remediation patch.';

  const code = isSample
    ? `// SECURE: Parameterized Query with Prepared Statements
const query = 'SELECT id, username, email FROM users WHERE id = ?';
const [rows] = await db.execute(query, [userId]);`
    : threat.fixed_code || threat.fix_code || '// Secure implementation\n// Parameterize input and apply validation.';

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      if (showToast) {
        showToast('📋 Copied to Clipboard', 'Secure code patch ready to paste.');
      }
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="feature-card rounded-[28px] max-w-3xl w-full p-8 border border-green-400/30 max-h-[90vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-sm hover:bg-white/20 transition-colors"
          title="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 text-xs font-mono green mb-2">
          <span className="status-light"></span>
          AI REMEDIATION & CODE FIX
        </div>

        <h3 className="text-2xl font-light text-white mb-6">
          {title}
        </h3>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-green-400/30 border-t-green-400 animate-spin mb-4"></div>
            <p className="text-sm font-mono text-white/40">
              Generating AI-powered security patch...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-mono text-white/40 mb-2">
                EXPLANATION & REMEDIATION STRATEGY
              </h4>
              <p className="text-sm text-white/70 leading-relaxed font-sans">
                {explanation}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-mono text-white/40">
                  REMEDIATED SOURCE CODE
                </h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-mono text-green-300 hover:text-green-200 transition-colors px-2 py-1 rounded bg-green-400/10 border border-green-400/20"
                >
                  {copied ? '✓ COPIED!' : '📋 COPY FIX'}
                </button>
              </div>

              <pre className="bg-black/60 border border-green-400/15 rounded-xl p-5 text-xs font-mono text-green-300/90 overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

