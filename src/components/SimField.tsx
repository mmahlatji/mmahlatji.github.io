import { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';

interface SimFieldProps {
  /** particles per 10_000 px^2 of canvas area */
  density?: number;
  /** paint an opaque field background so trails can fade */
  background?: string;
  className?: string;
  ariaLabel?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const SIGNAL = '0, 122, 204';

export default function SimField({
  density = 0.4,
  background,
  className,
  ariaLabel,
}: SimFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const bg = background ?? (theme === 'dark' ? '#1e1e1e' : '#ffffff');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let t = 0;
    let blob: HTMLCanvasElement | null = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const count = Math.max(
        24,
        Math.round(((width * height) / 10000) * density)
      );
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          vx: 0,
          vy: 0,
          // soft, overlapping blobs (metaballs)
          r: 5 + Math.random() * 7,
        };
      });
      if (bg) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const makeBlob = () => {
      // Pre-render the metaball blob once instead of allocating a radial
      // gradient per particle per frame. The blob is drawn scaled to each
      // particle's radius.
      const maxR = 12;
      const size = Math.ceil(maxR * 2 * dpr);
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const g = c.getContext('2d');
      if (!g) return;
      g.scale(dpr, dpr);
      const grad = g.createRadialGradient(maxR, maxR, 0, maxR, maxR, maxR);
      grad.addColorStop(0, `rgba(${SIGNAL}, 0.5)`);
      grad.addColorStop(0.55, `rgba(${SIGNAL}, 0.2)`);
      grad.addColorStop(1, `rgba(${SIGNAL}, 0)`);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(maxR, maxR, maxR, 0, Math.PI * 2);
      g.fill();
      blob = c;
    };

    const drawFluidParticle = (p: Particle) => {
      if (!blob) return;
      const size = p.r * 2;
      ctx.drawImage(blob, p.x - p.r, p.y - p.r, size, size);
    };

    const step = () => {
      if (!running) return;
      t += 0.016;

      if (bg) {
        ctx.fillStyle = bg;
        ctx.globalAlpha = 0.22;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // water: a coherent channel current, fastest mid-stream, that snakes
      // gently. No cohesion — droplets ride parallel streamlines so it reads
      // as flowing liquid, not blobs drifting.
      for (const p of particles) {
        const profile = Math.sin((p.y / height) * Math.PI); // 0 at edges, 1 mid
        const targetFlow = 0.7 + profile * 2.3;
        p.vx += (targetFlow - p.vx) * 0.05;
        p.vy +=
          (Math.sin(p.x * 0.022 + t * 1.3) * 0.55 +
            Math.cos(p.y * 0.03 + t * 0.7) * 0.2 -
            p.vy) *
          0.04;

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -24) p.x = width + 24;
        if (p.x > width + 24) p.x = -24;
        if (p.y < -24) p.y = height + 24;
        if (p.y > height + 24) p.y = -24;

        drawFluidParticle(p);
      }

      raf = requestAnimationFrame(step);
    };

    const drawStatic = () => {
      if (bg) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      for (const p of particles) {
        drawFluidParticle(p);
      }
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(step);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden && !reduced) start();
        else stop();
      },
      { rootMargin: '100px' }
    );
    io.observe(canvas);

    document.addEventListener('visibilitychange', onVisibility);

    makeBlob();
    resize();
    if (reduced) drawStatic();
    else start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) drawStatic();
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, bg]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={ariaLabel ?? 'Live particle simulation'}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
