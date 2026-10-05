import { useRef } from 'react';
import { useCanvasAnimation } from '../lib/useCanvasAnimation';
import type { CanvasSize } from '../lib/useCanvasAnimation';

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

const STAGE_LABELS = ['SHEETS', 'ADAPT', 'VALID', 'RECON', 'APPLIED', 'REVIEW', 'OFFER', 'ACCEPT', 'READY'];

export default function DataDemo({ className }: { className?: string }) {
  // dark inks on the light editor background
  const NEUTRAL = '66, 66, 66';
  const TRACK = 'rgba(0, 0, 0, 0.10)';
  const LABEL = '#5f5f5f';
  const state = useRef({ stages: [] as Stage[], records: [] as Rec[] });

  const spawn = (): Rec => {
    const a = state.current.stages[0];
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
    const a = state.current.stages[r.from];
    const b = state.current.stages[r.to];
    return {
      x: a.x + (b.x - a.x) * r.k,
      y: a.y + (b.y - a.y) * r.k + (r.dropping ? r.drop : 0),
    };
  };

  const draw = (ctx: CanvasRenderingContext2D, size: CanvasSize) => {
    ctx.clearRect(0, 0, size.width, size.height);
    const { stages, records } = state.current;

    // tracks
    ctx.strokeStyle = TRACK;
    ctx.lineWidth = 1;
    const topY = stages[0].y;
    const botY = stages[4].y;
    ctx.beginPath();
    ctx.moveTo(4, topY);
    ctx.lineTo(size.width - 4, topY);
    ctx.moveTo(4, botY);
    ctx.lineTo(size.width - 4, botY);
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
      ctx.fillStyle = r.dropping ? `rgba(${NEUTRAL}, 0.3)` : `rgba(${SIGNAL}, 0.85)`;
      // short trail
      ctx.strokeStyle = r.dropping ? `rgba(${NEUTRAL}, 0.18)` : `rgba(${SIGNAL}, 0.3)`;
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
    for (const r of state.current.records) {
      if (r.dropping) {
        r.drop += 0.7;
        if (r.drop > 30) Object.assign(r, spawn());
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

  const { ref } = useCanvasAnimation(
    {
      onResize: (_ctx, size) => {
        const topY = size.height * 0.3;
        const botY = size.height * 0.74;
        const xs = [0.1, 0.34, 0.56, 0.78, 0.08, 0.3, 0.5, 0.71, 0.92];
        const ys = [topY, topY, topY, topY, botY, botY, botY, botY, botY];
        state.current.stages = STAGE_LABELS.map((label, i) => ({
          label,
          x: size.width * xs[i],
          y: ys[i],
        }));
        state.current.records = Array.from({ length: 8 }, () => spawn());
      },
      onFrame: (ctx, size) => {
        step();
        draw(ctx, size);
      },
      onStatic: draw,
    },
    [NEUTRAL, TRACK, LABEL]
  );

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="Live ADMIT import pipeline — sheets normalise, validate, reconcile, then applications move through the lifecycle"
    />
  );
}
