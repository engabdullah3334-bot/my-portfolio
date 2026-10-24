import { useEffect, useRef } from 'react';
import { reduceMotion } from '../../lib/utils';

export default function Marquee({ items = [] }) {
  const marqRef = useRef(null);

  useEffect(() => {
    if (reduceMotion()) return;
    let last = window.scrollY;
    let tick = false;

    const frame = () => {
      const y = window.scrollY;
      const v = Math.max(-28, Math.min(28, y - last));
      last = y;
      if (marqRef.current) {
        marqRef.current.style.transform = `translate3d(${-(y * 0.5) % 1600}px, 0, 0) skewX(${(-v * 0.3).toFixed(1)}deg)`;
      }
      tick = false;
    };

    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(frame);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    frame();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const list = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/[0.08] bg-cyber-surface/30 py-4 backdrop-blur-sm select-none" aria-hidden="true">
      <div
        ref={marqRef}
        className="flex w-max will-change-transform transition-transform duration-75 ease-out"
      >
        {list.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-6 px-8 text-xl lg:text-2xl font-bold tracking-wider uppercase font-mono text-slate-500 hover:text-slate-200 transition-colors"
          >
            <span>{item}</span>
            <span className="text-sky-400/60 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
