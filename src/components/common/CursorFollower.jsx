import { useEffect, useRef, useState } from 'react';

/**
 * Custom interactive cyber cursor follower — fast dot + lagging glow ring.
 * Only activates on fine-pointer (mouse) devices, safely inactive on touch/mobile.
 */
export default function CursorFollower() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf;
    let mx = -200, my = -200;
    let dx = -200, dy = -200;
    let rx = -200, ry = -200;
    let hovering = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) setVisible(true);
    };

    const onOver = (e) => {
      hovering = !!e.target.closest('a, button, [role="button"], input, textarea, select, .clickable');
    };

    const tick = () => {
      dx += (mx - dx) * 0.85;
      dy += (my - dy) * 0.85;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${dx}px`;
        dotRef.current.style.top  = `${dy}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top  = `${ry}px`;
        ringRef.current.style.transform = `translate(-50%,-50%) scale(${hovering ? 2.2 : 1})`;
        ringRef.current.style.opacity = hovering ? '0.85' : '0.4';
        ringRef.current.style.borderColor = hovering
          ? 'rgba(0, 212, 255, 0.95)'
          : 'rgba(0, 212, 255, 0.5)';
        ringRef.current.style.boxShadow = hovering
          ? '0 0 16px rgba(0, 212, 255, 0.45)'
          : 'none';
      }
      raf = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add('custom-cursor-active');
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Precision Dot */}
      <div
        ref={dotRef}
        className="fixed w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00d4ff]"
      />
      {/* Ambient Magnetic Ring */}
      <div
        ref={ringRef}
        className="fixed w-8 h-8 rounded-full border border-cyber-cyan/50 transition-transform duration-150 ease-out"
      />
    </div>
  );
}
