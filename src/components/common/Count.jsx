import { useEffect, useRef, useState } from 'react';

/**
 * Animated number counter that counts up smoothly when scrolling into view.
 */
export default function Count({ to, suffix = '+', duration = 1400 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();

        const step = now => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic curve
          const current = Math.round(to * (1 - Math.pow(1 - progress, 3)));
          setVal(current);
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );

    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="font-bold tabular-nums">
      {val}{suffix}
    </span>
  );
}
