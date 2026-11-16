import React, { useState, useEffect } from 'react';

export default function EventHandlingOverlay({ toasts, removeToast }) {
  // 1. Scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // 2. Viewport indicator
  const [viewportText, setViewportText] = useState('');
  const [showViewport, setShowViewport] = useState(false);

  // 3. Keyboard hint
  const [keyHint, setKeyHint] = useState('');
  const [showKeyHint, setShowKeyHint] = useState(false);

  // 4. Custom context menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track resize
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      setViewportText(`VIEWPORT: ${window.innerWidth} × ${window.innerHeight} px`);
      setShowViewport(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowViewport(false);
      }, 1500);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Track keydown
  useEffect(() => {
    let timeoutId;
    const handleKeyDown = (e) => {
      // Don't intercept when typing in input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      setKeyHint(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      setShowKeyHint(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowKeyHint(false);
      }, 2000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, []);

  // Custom Context Menu on right click
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      const x = Math.min(e.clientX, window.innerWidth - 230);
      const y = Math.min(e.clientY, window.innerHeight - 260);
      setContextMenu({ visible: true, x, y });
    };

    const handleClickOutside = () => {
      setContextMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleContextAction = (action) => {
    setContextMenu({ visible: false, x: 0, y: 0 });

    if (action === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'scan') {
      document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'theme') {
      const isFiltered = document.body.style.filter.includes('invert');
      document.body.style.filter = isFiltered ? '' : 'invert(1) hue-rotate(180deg)';
    } else if (action === 'fullscreen') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <>
      {/* Scroll Progress Bar (Top) */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Viewport Dimension Indicator (Resize event) */}
      <div
        className={`viewport-indicator ${showViewport ? 'opacity-100' : 'opacity-0'}`}
      >
        {viewportText}
      </div>

      {/* Keyboard Shortcut Hint (Keydown event) */}
      <div
        className={`keyboard-hint ${showKeyHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      >
        <span>Key pressed: </span>
        <kbd>{keyHint}</kbd>
      </div>

      {/* Custom Context Menu (Contextmenu event) */}
      {contextMenu.visible && (
        <div
          className="custom-context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="ctx-menu-item"
            onClick={() => handleContextAction('home')}
          >
            🏠 Go to Home
          </div>
          <div
            className="ctx-menu-item"
            onClick={() => handleContextAction('scan')}
          >
            🔍 Open Scanner
          </div>
          <div className="ctx-menu-divider" />
          <div
            className="ctx-menu-item"
            onClick={() => handleContextAction('theme')}
          >
            🎨 Toggle Theme Invert
          </div>
          <div
            className="ctx-menu-item"
            onClick={() => handleContextAction('fullscreen')}
          >
            ⛶ Toggle Fullscreen
          </div>
          <div className="ctx-menu-divider" />
          <div className="ctx-menu-item text-white/25 cursor-default text-[9px] hover:bg-transparent hover:text-white/25">
            SOC-AI React v2.0 • Security Suite
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed top-6 right-6 z-[9998] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="event-toast pointer-events-auto"
            onClick={() => removeToast(t.id)}
          >
            <div className="toast-title font-bold text-white text-xs mb-1">
              {t.title}
            </div>
            <div className="toast-body text-white/60 text-[11px] leading-relaxed">
              {t.body}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

