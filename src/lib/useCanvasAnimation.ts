import { useCallback, useEffect, useRef } from 'react';

export interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

export interface CanvasHandlers {
  /** Called after every resize — re-seed/reposition state. */
  onResize?: (ctx: CanvasRenderingContext2D, size: CanvasSize) => void;
  /** Called each animation frame. */
  onFrame?: (ctx: CanvasRenderingContext2D, size: CanvasSize) => void;
  /** Called once when prefers-reduced-motion is on, instead of the frame loop. */
  onStatic?: (ctx: CanvasRenderingContext2D, size: CanvasSize) => void;
}

interface CanvasAnimation {
  ref: React.RefObject<HTMLCanvasElement | null>;
  /** Manually redraw once (e.g. for pointer interaction under reduced motion). */
  redraw: () => void;
}

/**
 * Owns the shared canvas lifecycle: DPR-aware sizing, requestAnimationFrame
 * loop, IntersectionObserver, ResizeObserver, visibility handling, and
 * prefers-reduced-motion. Demos supply only resize/frame/static callbacks.
 */
export function useCanvasAnimation(
  handlers: CanvasHandlers,
  deps: unknown[] = []
): CanvasAnimation {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size: CanvasSize = { width: 0, height: 0, dpr: 1 };
    let raf = 0;
    let running = false;
    let visible = true;

    const h = () => handlersRef.current;

    redrawRef.current = () => {
      const cur = h();
      const draw = cur.onStatic ?? cur.onFrame;
      draw?.(ctx, size);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size.dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.width = Math.max(1, rect.width);
      size.height = Math.max(1, rect.height);
      canvas.width = Math.round(size.width * size.dpr);
      canvas.height = Math.round(size.height * size.dpr);
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      h().onResize?.(ctx, size);
      if (reduced) h().onStatic?.(ctx, size);
    };

    const loop = () => {
      if (!running) return;
      h().onFrame?.(ctx, size);
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

    const onVis = () => (document.hidden ? stop() : visible && start());
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden && !reduced) start();
        else stop();
      },
      { rootMargin: '100px' }
    );
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVis);

    resize();
    if (!reduced) start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const redraw = useCallback(() => redrawRef.current(), []);
  return { ref, redraw };
}
