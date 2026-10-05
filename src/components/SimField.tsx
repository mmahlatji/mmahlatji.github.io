import { useRef } from 'react';
import { useCanvasAnimation } from '../lib/useCanvasAnimation';
import type { CanvasSize } from '../lib/useCanvasAnimation';

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

/* Pre-render the metaball blob once instead of allocating a radial gradient per
 * particle per frame. The blob is drawn scaled to each particle's radius. */
function makeBlob(): HTMLCanvasElement {
  const maxR = 12;
  const c = document.createElement('canvas');
  c.width = maxR * 2;
  c.height = maxR * 2;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(maxR, maxR, 0, maxR, maxR, maxR);
    grad.addColorStop(0, `rgba(${SIGNAL}, 0.5)`);
    grad.addColorStop(0.55, `rgba(${SIGNAL}, 0.2)`);
    grad.addColorStop(1, `rgba(${SIGNAL}, 0)`);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(maxR, maxR, maxR, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

export default function SimField({
  density = 0.4,
  background,
  className,
  ariaLabel,
}: SimFieldProps) {
  const state = useRef({ particles: [] as Particle[], blob: makeBlob(), t: 0 });
  const bg = background ?? '#ffffff';

  const paintBackdrop = (ctx: CanvasRenderingContext2D, size: CanvasSize) => {
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size.width, size.height);
    } else {
      ctx.clearRect(0, 0, size.width, size.height);
    }
  };

  const { ref } = useCanvasAnimation(
    {
      onResize: (ctx, size) => {
        const count = Math.max(
          24,
          Math.round(((size.width * size.height) / 10000) * density)
        );
        state.current.particles = Array.from({ length: count }, () => ({
          x: Math.random() * size.width,
          y: Math.random() * size.height,
          vx: 0,
          vy: 0,
          r: 5 + Math.random() * 7,
        }));
        paintBackdrop(ctx, size);
      },
      onFrame: (ctx, size) => {
        const s = state.current;
        s.t += 0.016;

        ctx.fillStyle = bg;
        ctx.globalAlpha = 0.22;
        ctx.fillRect(0, 0, size.width, size.height);
        ctx.globalAlpha = 1;

        // water: a coherent channel current, fastest mid-stream, that snakes
        // gently. No cohesion — droplets ride parallel streamlines so it reads
        // as flowing liquid, not blobs drifting.
        for (const p of s.particles) {
          const profile = Math.sin((p.y / size.height) * Math.PI); // 0 at edges, 1 mid
          const targetFlow = 0.7 + profile * 2.3;
          p.vx += (targetFlow - p.vx) * 0.05;
          p.vy +=
            (Math.sin(p.x * 0.022 + s.t * 1.3) * 0.55 +
              Math.cos(p.y * 0.03 + s.t * 0.7) * 0.2 -
              p.vy) *
            0.04;

          p.vx *= 0.97;
          p.vy *= 0.97;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -24) p.x = size.width + 24;
          if (p.x > size.width + 24) p.x = -24;
          if (p.y < -24) p.y = size.height + 24;
          if (p.y > size.height + 24) p.y = -24;

          ctx.drawImage(s.blob, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        }
      },
      onStatic: (ctx, size) => {
        paintBackdrop(ctx, size);
        for (const p of state.current.particles) {
          ctx.drawImage(state.current.blob, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        }
      },
    },
    [density, bg]
  );

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label={ariaLabel ?? 'Live particle simulation'}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
