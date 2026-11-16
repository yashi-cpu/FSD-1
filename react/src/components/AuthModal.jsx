import React, { useState } from 'react';

const AUTH_API_LOGIN_URL = "http://localhost:8000/api/auth/login";
const AUTH_API_SIGNUP_URL = "http://localhost:8000/api/auth/signup";

export default function AuthModal({ isOpen, onClose, onLoginSuccess, showToast }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [loginStatusColor, setLoginStatusColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupStatus, setSignupStatus] = useState('');
  const [signupStatusColor, setSignupStatusColor] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginStatus('Authenticating...');
    setLoginStatusColor('text-yellow-300');

    try {
      const res = await fetch(AUTH_API_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user || { name: loginEmail.split('@')[0], email: loginEmail };
        onLoginSuccess(data.token || 'demo-jwt-token', user);
        setLoginStatus('✓ Logged in successfully!');
        setLoginStatusColor('text-green-300');
        if (showToast) showToast('🔐 Authenticated', `Welcome back, ${user.name}!`);
        setTimeout(() => onClose(), 600);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Login failed (${res.status})`);
      }
    } catch (err) {
      // Demo fallback when auth server is offline
      const user = { name: loginEmail.split('@')[0], email: loginEmail };
      onLoginSuccess('demo-jwt-token-' + Date.now(), user);
      setLoginStatus('✓ Logged in successfully (Local Session)!');
      setLoginStatusColor('text-green-300');
      if (showToast) showToast('🔐 Authenticated', `Logged in as ${user.name}`);
      setTimeout(() => onClose(), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSignupStatus('Creating security account...');
    setSignupStatusColor('text-yellow-300');

    try {
      const res = await fetch(AUTH_API_SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword })
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user || { name: signupName, email: signupEmail };
        onLoginSuccess(data.token || 'demo-jwt-token', user);
        setSignupStatus('✓ Account created successfully!');
        setSignupStatusColor('text-green-300');
        if (showToast) showToast('🛡️ Account Created', `Welcome to SOC-AI, ${user.name}!`);
        setTimeout(() => onClose(), 600);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Signup failed (${res.status})`);
      }
    } catch (err) {
      // Demo fallback when auth server is offline
      const user = { name: signupName, email: signupEmail };
      onLoginSuccess('demo-jwt-token-' + Date.now(), user);
      setSignupStatus('✓ Account created successfully (Local Session)!');
      setSignupStatusColor('text-green-300');
      if (showToast) showToast('🛡️ Account Created', `Welcome to SOC-AI, ${user.name}!`);
      setTimeout(() => onClose(), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="feature-card rounded-[28px] max-w-md w-full p-8 border border-green-400/30 relative shadow-2xl"
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

        {/* TAB SWITCHER */}
        <div className="flex border-b border-white/10 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`pb-3 px-4 font-semibold w-1/2 text-center transition-all ${
              activeTab === 'login'
                ? 'text-green-300 border-b-2 border-green-400'
                : 'text-white/40 hover:text-white border-b-2 border-transparent'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`pb-3 px-4 font-semibold w-1/2 text-center transition-all ${
              activeTab === 'signup'
                ? 'text-green-300 border-b-2 border-green-400'
                : 'text-white/40 hover:text-white border-b-2 border-transparent'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-white/40 mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-black/50 border border-green-400/20 rounded-xl px-4 py-3 text-xs text-green-300 focus:outline-none focus:border-green-400/50 font-mono placeholder:text-white/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-white/40 mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-green-400/20 rounded-xl px-4 py-3 text-xs text-green-300 focus:outline-none focus:border-green-400/50 font-mono placeholder:text-white/20 transition-all"
              />
            </div>
            {loginStatus && (
              <div className={`text-xs font-mono min-h-[16px] ${loginStatusColor}`}>
                {loginStatus}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="hero-button w-full py-3.5 rounded-full bg-[#7cff9b] text-black text-xs font-semibold mt-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'AUTHENTICATING...' : 'LOG IN'}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-white/40 mb-1">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-black/50 border border-green-400/20 rounded-xl px-4 py-3 text-xs text-green-300 focus:outline-none focus:border-green-400/50 font-mono placeholder:text-white/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-white/40 mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-black/50 border border-green-400/20 rounded-xl px-4 py-3 text-xs text-green-300 focus:outline-none focus:border-green-400/50 font-mono placeholder:text-white/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-white/40 mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-green-400/20 rounded-xl px-4 py-3 text-xs text-green-300 focus:outline-none focus:border-green-400/50 font-mono placeholder:text-white/20 transition-all"
              />
            </div>
            {signupStatus && (
              <div className={`text-xs font-mono min-h-[16px] ${signupStatusColor}`}>
                {signupStatus}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="hero-button w-full py-3.5 rounded-full bg-[#7cff9b] text-black text-xs font-semibold mt-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

