import { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';

/**
 * ADMIT's import pipeline, drawn as the process it actually is — not a graph.
 *
 * A sheet of rows enters on the left, is normalised (ADAPT), validated (VALID,
 * with bad rows dropped), and reconciled (RECON) before entering the applicant
 * lifecycle: APPLIED -> REVIEW -> OFFER -> ACCEPT -> READY, with a minority
 * denied along the way. Mirrors app/services/imports/orchestrator.py and
 * app/services/state/application_state_machine.py.
 */

interface Stage {
  label: string;
  x: number;
  y: number;
}

interface Rec {
  from: number;
  to: number;
  k: number;
  dropping: boolean;
  drop: number;
  px: number;
  py: number;
}

const SIGNAL = '0, 122, 204';
const FONT = '8px "JetBrains Mono", monospace';

export default function DataDemo({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  // neutral greys are dark-mode-first; in light mode use dark inks
  const NEUTRAL = theme === 'dark' ? '212, 212, 212' : '66, 66, 66';
  const TRACK = theme === 'dark' ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.10)';
  const LABEL = theme === 'dark' ? '#9d9d9d' : '#5f5f5f';

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
    let stages: Stage[] = [];
    let records: Rec[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const topY = height * 0.3;
      const botY = height * 0.74;
      stages = [
        { label: 'SHEETS', x: width * 0.1, y: topY },
        { label: 'ADAPT', x: width * 0.34, y: topY },
        { label: 'VALID', x: width * 0.56, y: topY },
        { label: 'RECON', x: width * 0.78, y: topY },
        { label: 'APPLIED', x: width * 0.08, y: botY },
        { label: 'REVIEW', x: width * 0.3, y: botY },
        { label: 'OFFER', x: width * 0.5, y: botY },
        { label: 'ACCEPT', x: width * 0.71, y: botY },
        { label: 'READY', x: width * 0.92, y: botY },
      ];
      records = Array.from({ length: 8 }, () => spawn());
      if (reduced) draw();
    };

    const spawn = (): Rec => {
      const a = stages[0];
      return {
        from: 0,
        to: 1,
        k: Math.random(),
        dropping: false,
        drop: 0,
        px: a.x,
        py: a.y,
      };
    };

    const recordPos = (r: Rec) => {
      const a = stages[r.from];
      const b = stages[r.to];
      return {
        x: a.x + (b.x - a.x) * r.k,
        y: a.y + (b.y - a.y) * r.k + (r.dropping ? r.drop : 0),
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // tracks
      ctx.strokeStyle = TRACK;
      ctx.lineWidth = 1;
      const topY = stages[0].y;
      const botY = stages[4].y;
      ctx.beginPath();
      ctx.moveTo(4, topY);
      ctx.lineTo(width - 4, topY);
      ctx.moveTo(4, botY);
      ctx.lineTo(width - 4, botY);
      ctx.stroke();

      // a sheet of rows on the far left
      ctx.fillStyle = `rgba(${NEUTRAL}, 0.45)`;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(4, topY - 14 + i * 5, 12, 2.5);
      }

      // stage ticks + labels
      ctx.font = FONT;
      ctx.textAlign = 'center';
      for (const s of stages) {
        ctx.strokeStyle = `rgba(${NEUTRAL}, 0.35)`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - 4);
        ctx.lineTo(s.x, s.y + 4);
        ctx.stroke();
        ctx.fillStyle = LABEL;
        ctx.fillText(s.label, s.x, s.y - 10);
      }

      // records — horizontal row bars
      for (const r of records) {
        const pos = recordPos(r);
        if (r.dropping) {
          ctx.fillStyle = `rgba(${NEUTRAL}, 0.3)`;
        } else {
          ctx.fillStyle = `rgba(${SIGNAL}, 0.85)`;
        }
        // short trail
        ctx.strokeStyle = r.dropping
          ? `rgba(${NEUTRAL}, 0.18)`
          : `rgba(${SIGNAL}, 0.3)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(r.px, r.py);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        // the row
        ctx.fillRect(pos.x - 6, pos.y - 2, 12, 4);
        r.px = pos.x;
        r.py = pos.y;
      }
    };

    const step = () => {
      for (const r of records) {
        if (r.dropping) {
          r.drop += 0.7;
          if (r.drop > 30) {
            Object.assign(r, spawn());
          }
          continue;
        }

        r.k += 0.013;
        if (r.k >= 1) {
          r.from = r.to;
          r.k = 0;
          // VALID rejects bad rows; OFFER denies a minority
          if (r.from === 2 && Math.random() < 0.18) {
            r.dropping = true;
            r.drop = 0;
            continue;
          }
          if (r.from === 6 && Math.random() < 0.22) {
            r.dropping = true;
            r.drop = 0;
            continue;
          }
          if (r.from === 8) {
            Object.assign(r, spawn());
            continue;
          }
          r.to = Math.min(r.to + 1, 8);
        }
      }
    };

    const loop = () => {
      if (!running) return;
      step();
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

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden && !reduced) start();
        else stop();
      },
      { rootMargin: '100px' }
    );
    io.observe(canvas);
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
    };
  }, [theme, NEUTRAL, TRACK, LABEL]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Live ADMIT import pipeline — sheets normalise, validate, reconcile, then applications move through the lifecycle"
    />
  );
}
