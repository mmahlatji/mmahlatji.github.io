import { useEffect, useRef } from 'react';
import { useCanvasAnimation } from '../lib/useCanvasAnimation';
import type { CanvasSize } from '../lib/useCanvasAnimation';

interface Circle {
  x: number;
  y: number;
  r: number;
}

const RAYS = 260;
const SIGNAL = '0, 122, 204';

/**
 * A live 2D ray tracer: a draggable light source casts rays that
 * stop at the first obstacle they hit, leaving shadows behind it.
 * Mirrors the subject's own 2D ray-tracer project.
 */
export default function RayDemo({ className }: { className?: string }) {
  const OCCLUDER = '#3f3f3f';
  const state = useRef({ light: { x: 0, y: 0 }, circles: [] as Circle[] });

  const cast = (ox: number, oy: number, dx: number, dy: number, size: CanvasSize) => {
    let tMin = Infinity;
    for (const c of state.current.circles) {
      const fx = ox - c.x;
      const fy = oy - c.y;
      const a = dx * dx + dy * dy;
      const b = 2 * (fx * dx + fy * dy);
      const cc = fx * fx + fy * fy - c.r * c.r;
      const disc = b * b - 4 * a * cc;
      if (disc < 0) continue;
      const sq = Math.sqrt(disc);
      const t1 = (-b - sq) / (2 * a);
      const t2 = (-b + sq) / (2 * a);
      if (t1 > 0.0001 && t1 < tMin) tMin = t1;
      if (t2 > 0.0001 && t2 < tMin) tMin = t2;
    }
    // also stop at the canvas edge
    const ex = dx !== 0 ? (dx > 0 ? (size.width - ox) / dx : -ox / dx) : Infinity;
    const ey = dy !== 0 ? (dy > 0 ? (size.height - oy) / dy : -oy / dy) : Infinity;
    return Math.min(tMin, Math.min(ex, ey));
  };

  const draw = (ctx: CanvasRenderingContext2D, size: CanvasSize) => {
    const { light } = state.current;
    ctx.clearRect(0, 0, size.width, size.height);

    // soft light halo
    const g = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 90);
    g.addColorStop(0, `rgba(${SIGNAL}, 0.14)`);
    g.addColorStop(1, `rgba(${SIGNAL}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(light.x - 90, light.y - 90, 180, 180);

    // rays
    ctx.strokeStyle = `rgba(${SIGNAL}, 0.5)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < RAYS; i++) {
      const a = (i / RAYS) * Math.PI * 2;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const tHit = cast(light.x, light.y, dx, dy, size);
      ctx.moveTo(light.x, light.y);
      ctx.lineTo(light.x + dx * tHit, light.y + dy * tHit);
    }
    ctx.stroke();

    // obstacles (occluders)
    for (const c of state.current.circles) {
      ctx.fillStyle = OCCLUDER;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // light source
    ctx.fillStyle = `rgba(${SIGNAL}, 1)`;
    ctx.beginPath();
    ctx.arc(light.x, light.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${SIGNAL}, 0.6)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(light.x, light.y, 9, 0, Math.PI * 2);
    ctx.stroke();
  };

  const { ref, redraw } = useCanvasAnimation(
    {
      onResize: (_ctx, size) => {
        const s = state.current;
        s.light = { x: size.width * 0.72, y: size.height * 0.34 };
        s.circles = [
          { x: size.width * 0.32, y: size.height * 0.28, r: Math.min(size.width, size.height) * 0.11 },
          { x: size.width * 0.48, y: size.height * 0.7, r: Math.min(size.width, size.height) * 0.15 },
          { x: size.width * 0.2, y: size.height * 0.66, r: Math.min(size.width, size.height) * 0.07 },
        ];
      },
      onFrame: draw,
      onStatic: draw,
    },
    [OCCLUDER]
  );

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.current.light = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      redraw();
    };
    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      onMove(e);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
    };
  }, [ref, redraw]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ touchAction: 'none', cursor: 'crosshair' }}
      role="img"
      aria-label="Interactive 2D ray tracer — drag the light source"
    />
  );
}
