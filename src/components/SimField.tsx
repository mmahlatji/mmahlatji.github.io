import { useEffect, useRef } from 'react';

export type FieldMode = 'ink' | 'fluid';

interface SimFieldProps {
  mode?: FieldMode;
  interactive?: boolean;
  /** particles per 10_000 px^2 of canvas area */
  density?: number;
  /** draw the cursor's signal glow (interactive hero only) */
  glow?: boolean;
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
  hx: number;
  hy: number;
}

const INK = '22, 22, 22';
const SIGNAL = '36, 64, 216';

export default function SimField({
  mode = 'ink',
  interactive = false,
  density = 0.4,
  glow = false,
  background,
  className,
  ariaLabel,
}: SimFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    const pointer = { x: -9999, y: -9999, active: false };

    const isFluid = mode === 'fluid';
    const rgb = isFluid ? SIGNAL : INK;

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
          // fluid uses soft, overlapping blobs (metaballs); ink uses fine marks
          r: isFluid ? 5 + Math.random() * 7 : 0.6 + Math.random() * 1.1,
          hx: x,
          hy: y,
        };
      });
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const drawInkParticle = (p: Particle, alpha: number) => {
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFluidParticle = (p: Particle) => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(${SIGNAL}, 0.5)`);
      g.addColorStop(0.55, `rgba(${SIGNAL}, 0.2)`);
      g.addColorStop(1, `rgba(${SIGNAL}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const step = () => {
      if (!running) return;
      t += 0.016;

      if (background) {
        ctx.fillStyle = background;
        ctx.globalAlpha = isFluid ? 0.22 : 0.16;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      if (isFluid) {
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
      } else {
        const wind = 0.0012;
        const damp = 0.9;
        for (const p of particles) {
          const wx =
            Math.sin(p.y * 0.012 + t * 0.5) * 0.5 +
            Math.cos(p.y * 0.004 + t * 0.2) * 0.3;
          const wy =
            Math.cos(p.x * 0.012 + t * 0.4) * 0.5 +
            Math.sin(p.x * 0.005 + t * 0.22) * 0.3;
          p.vx += wx * wind;
          p.vy += wy * wind;

          p.vx += (p.hx - p.x) * 0.0008;
          p.vy += (p.hy - p.y) * 0.0008;

          if (interactive && pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            const R = 180;
            if (d2 < R * R && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = ((R - d) / R) * 0.9;
              p.vx += (dx / d) * f;
              p.vy += (dy / d) * f;
            }
          }

          p.vx *= damp;
          p.vy *= damp;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -12) p.x = width + 12;
          if (p.x > width + 12) p.x = -12;
          if (p.y < -12) p.y = height + 12;
          if (p.y > height + 12) p.y = -12;

          drawInkParticle(p, 0.42);
        }
      }

      if (glow && interactive && pointer.active) {
        const g = ctx.createRadialGradient(
          pointer.x, pointer.y, 0,
          pointer.x, pointer.y, 130
        );
        g.addColorStop(0, `rgba(${SIGNAL}, 0.12)`);
        g.addColorStop(1, `rgba(${SIGNAL}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(pointer.x - 130, pointer.y - 130, 260, 260);

        ctx.strokeStyle = `rgba(${SIGNAL}, 0.35)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(step);
    };

    const drawStatic = () => {
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      for (const p of particles) {
        if (isFluid) drawFluidParticle(p);
        else drawInkParticle(p, 0.32);
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

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active =
        pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
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

    if (interactive) {
      window.addEventListener('pointermove', onPointerMove);
    }
    document.addEventListener('visibilitychange', onVisibility);

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
      if (interactive) {
        window.removeEventListener('pointermove', onPointerMove);
      }
    };
  }, [mode, interactive, density, glow, background]);

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
