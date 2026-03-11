'use client';

import { useEffect, useRef } from 'react';

export default function IframeResizeProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.parent === window) return;

    // Prevent html/body from stretching to viewport height
    // so the wrapper div's offsetHeight reflects actual content
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.minHeight = '0';
    document.body.style.minHeight = '0';

    let lastHeight = 0;

    const sendHeight = () => {
      const height = el.offsetHeight;
      if (height !== lastHeight) {
        lastHeight = height;
        window.parent.postMessage({ type: 'mm-resize', height }, '*');
      }
    };

    // MutationObserver: reacts to DOM changes (step transitions)
    // NOT using ResizeObserver — it would react to iframe resize = loop
    const observer = new MutationObserver(() => {
      requestAnimationFrame(sendHeight);
    });
    observer.observe(el, { childList: true, subtree: true });

    // Initial measurement
    sendHeight();

    // Safety net for image loads, font loads, CSS transitions
    const interval = setInterval(sendHeight, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div ref={ref} className="px-4 py-6 sm:px-8 sm:py-8" data-embed="true">
      {children}
    </div>
  );
}
