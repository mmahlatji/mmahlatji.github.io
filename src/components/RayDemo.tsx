import { useEffect, useRef } from 'react';

/**
 * A live 2D ray tracer: a draggable light source casts rays that
 * stop at the first obstacle they hit, leaving shadows behind it.
 * Mirrors the subject's own 2D ray-tracer project.
 */
export default function RayDemo({ className }: { className?: string }) {
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
    let raf = 0;
    let running = false;
    let visible = true;
    const light = { x: 0, y: 0, active: true };
    let circles: { x: number; y: number; r: number }[] = [];

    const RAYS = 260;
    const SIGNAL = '0, 122, 204';
    const OCCLUDER = '#d4d4d4';

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      light.x = width * 0.72;
      light.y = height * 0.34;
      circles = [
        { x: width * 0.32, y: height * 0.28, r: Math.min(width, height) * 0.11 },
        { x: width * 0.48, y: height * 0.7, r: Math.min(width, height) * 0.15 },
        { x: width * 0.2, y: height * 0.66, r: Math.min(width, height) * 0.07 },
      ];
      if (reduced) draw();
    };

    const cast = (ox: number, oy: number, dx: number, dy: number) => {
      let tMin = Infinity;
      for (const c of circles) {
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
      const ex = dx !== 0 ? (dx > 0 ? (width - ox) / dx : -ox / dx) : Infinity;
      const ey = dy !== 0 ? (dy > 0 ? (height - oy) / dy : -oy / dy) : Infinity;
      const tEdge = Math.min(ex, ey);
      return Math.min(tMin, tEdge);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

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
        const tHit = cast(light.x, light.y, dx, dy);
        ctx.moveTo(light.x, light.y);
        ctx.lineTo(light.x + dx * tHit, light.y + dy * tHit);
      }
      ctx.stroke();

      // obstacles (occluders)
      for (const c of circles) {
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

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      light.x = e.clientX - rect.left;
      light.y = e.clientY - rect.top;
      light.active = true;
      if (reduced) draw();
    };
    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      onMove(e);
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

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    const onVis = () => (document.hidden ? stop() : visible && start());
    document.addEventListener('visibilitychange', onVis);

    resize();
    if (reduced) draw();
    else start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ touchAction: 'none' }}
      role="img"
      aria-label="Interactive 2D ray tracer — drag the light source"
    />
  );
}
