import { useEffect, useRef } from 'react';
import { reduceMotion } from '../../lib/utils';

/**
 * Fixed background HTML5 Canvas:
 * Renders subtle PCB circuit traces and animated electrical pulses that accelerate upon scrolling.
 * Uses an offscreen buffer for optimal performance at capped 30-40fps.
 */
export default function Wires() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext('2d');
    const GAP = 14;
    const reduce = reduceMotion();
    const base = document.createElement('canvas');
    const b = base.getContext('2d');

    let W, H;
    let paths = [];
    let lastY = window.scrollY;
    let boost = 0;
    let prev = 0;
    let raf;

    const bundle = (n, dir, y0, L, D, yEnd, vy) => {
      for (let k = 0; k < n; k++) {
        const x0 = dir > 0 ? 0 : W;
        const y = y0 - vy * k * GAP;
        const xh = x0 + dir * (L + k * GAP);
        const xd = xh + dir * D;
        const pts = [
          [x0, y],
          [xh, y],
          [xd, y + vy * D],
          [xd, yEnd]
        ];
        const cum = [0];
        for (let i = 1; i < 4; i++) {
          cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        }
        paths.push({
          pts,
          cum,
          len: cum[3],
          pulses: [
            { s: Math.random() * cum[3], v: 65 + Math.random() * 85 },
            { s: Math.random() * cum[3], v: 45 + Math.random() * 55 }
          ]
        });
      }
    };

    const build = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = base.width = W * d;
      cv.height = base.height = H * d;
      g.setTransform(d, 0, 0, d, 0, 0);
      b.setTransform(d, 0, 0, d, 0, 0);
      paths = [];

      bundle(7, 1, H * 0.55, W * 0.04, 60, H + 20, 1);
      bundle(5, 1, H * 0.16, W * 0.03, 40, H * 0.36, 1);
      bundle(7, -1, H * 0.68, W * 0.12, 85, H + 20, 1);
      bundle(5, -1, H * 0.22, W * 0.06, 45, H * 0.48, 1);

      b.clearRect(0, 0, W, H);
      b.lineWidth = 1;
      b.strokeStyle = 'rgba(0, 212, 255, 0.12)';
      paths.forEach(p => {
        b.beginPath();
        p.pts.forEach((q, i) => (i ? b.lineTo(q[0], q[1]) : b.moveTo(q[0], q[1])));
        b.stroke();
        b.beginPath();
        b.arc(p.pts[3][0], p.pts[3][1], 2.2, 0, Math.PI * 2);
        b.stroke();
      });

      g.clearRect(0, 0, W, H);
      g.drawImage(base, 0, 0, W, H);
    };

    const seg = (p, a, c) => {
      g.beginPath();
      let started = false;
      for (let i = 1; i < 4; i++) {
        const c0 = p.cum[i - 1], c1 = p.cum[i];
        if (c1 < a || c0 > c) continue;
        const t0 = Math.max(a, c0) - c0;
        const t1 = Math.min(c, c1) - c0;
        const [x0, y0] = p.pts[i - 1];
        const [x1, y1] = p.pts[i];
        const k = c1 - c0;
        if (!started) {
          g.moveTo(x0 + (x1 - x0) * t0 / k, y0 + (y1 - y0) * t0 / k);
          started = true;
        }
        g.lineTo(x0 + (x1 - x0) * t1 / k, y0 + (y1 - y0) * t1 / k);
      }
      g.stroke();
    };

    const draw = t => {
      raf = requestAnimationFrame(draw);
      if (t - prev < 32) return; // ~30fps cap for smooth efficiency
      const dt = Math.min((t - prev) / 1000, 0.06);
      prev = t;

      boost += (Math.min(Math.abs(window.scrollY - lastY), 60) - boost) * 0.15;
      lastY = window.scrollY;

      g.clearRect(0, 0, W, H);
      g.drawImage(base, 0, 0, W, H);

      g.lineCap = 'round';
      g.strokeStyle = '#00d4ff';

      // Soft glow passes
      [[6, 0.08], [3, 0.22], [1.5, 0.9]].forEach(([w, a]) => {
        g.lineWidth = w;
        g.globalAlpha = a;
        paths.forEach(p => p.pulses.forEach(u => seg(p, u.s - 80, u.s)));
      });

      g.globalAlpha = 1;
      paths.forEach(p =>
        p.pulses.forEach(u => {
          u.s = (u.s + u.v * (1 + boost * 0.14) * dt) % (p.len + 120);
        })
      );
    };

    build();
    window.addEventListener('resize', build);
    if (!reduce) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
    };
  }, []);

  return <canvas id="wires" ref={ref} aria-hidden="true" />;
}
