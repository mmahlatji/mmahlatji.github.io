import { useRef } from 'react';
import { useCanvasAnimation } from '../lib/useCanvasAnimation';
import type { CanvasSize } from '../lib/useCanvasAnimation';

/**
 * The grapheme-to-phoneme pipeline, drawn as an encoder/decoder with attention.
 *
 * A word's characters enter the encoder one by one (top row), then the decoder
 * emits phonemes one at a time (bottom row) while an attention sweep moves
 * across the source characters. Mirrors the LSTM encoder/decoder + attention
 * architectures compared in the notebook.
 */

interface Word {
  word: string;
  phones: string[];
}

const WORDS: Word[] = [
  { word: 'HELLO', phones: ['HH', 'AH0', 'L', 'OW1'] },
  { word: 'WORLD', phones: ['W', 'ER1', 'L', 'D'] },
  { word: 'PYTHON', phones: ['P', 'AY1', 'TH', 'AA0', 'N'] },
  { word: 'COMPUTER', phones: ['K', 'AH0', 'M', 'P', 'Y', 'UW1', 'T', 'ER0'] },
  { word: 'LISTEN', phones: ['L', 'IH1', 'S', 'AH0', 'N'] },
];

const SIGNAL = '0, 122, 204';
const PHON = '9, 134, 88';
const INK = '66, 66, 66';
const FONT = '9px "JetBrains Mono", monospace';

const ENC_SPEED = 10;
const DEC_SPEED = 14;
const HOLD = 50;

export default function Seq2SeqDemo({ className }: { className?: string }) {
  const state = useRef({ wordIdx: 0, tick: 0, charsShown: 0, phonesShown: 0, attn: 0 });

  const step = () => {
    const s = state.current;
    s.tick++;
    const cur = WORDS[s.wordIdx];
    const total = cur.word.length * ENC_SPEED + cur.phones.length * DEC_SPEED + HOLD;
    if (s.tick >= total) {
      s.wordIdx = (s.wordIdx + 1) % WORDS.length;
      s.tick = 0;
    }
    const w = WORDS[s.wordIdx];
    const encEnd = w.word.length * ENC_SPEED;
    const decEnd = encEnd + w.phones.length * DEC_SPEED;
    const t = s.tick;
    if (t < encEnd) {
      s.charsShown = Math.floor(t / ENC_SPEED) + 1;
      s.phonesShown = 0;
      s.attn = 0;
    } else if (t < decEnd) {
      s.charsShown = w.word.length;
      const d = t - encEnd;
      s.phonesShown = Math.floor(d / DEC_SPEED) + 1;
      s.attn = (d % DEC_SPEED) / DEC_SPEED;
    } else {
      s.charsShown = w.word.length;
      s.phonesShown = w.phones.length;
      s.attn = 1;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, size: CanvasSize) => {
    ctx.clearRect(0, 0, size.width, size.height);
    const s = state.current;
    const w = WORDS[s.wordIdx];
    const n = w.word.length;
    const m = w.phones.length;

    const maxCells = Math.max(n, m);
    const gap = 6;
    const pad = 20;
    const cellW = Math.max(16, Math.min(26, (size.width - pad * 2 - gap * (maxCells - 1)) / maxCells));
    const cellH = 22;
    const topY = size.height * 0.28;
    const botY = size.height * 0.64;

    const encW = n * cellW + (n - 1) * gap;
    const decW = m * cellW + (m - 1) * gap;
    const encX = (size.width - encW) / 2;
    const decX = (size.width - decW) / 2;

    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < n; i++) {
      const x = encX + i * (cellW + gap);
      const on = i < s.charsShown;
      roundRect(ctx, x, topY, cellW, cellH, 3);
      if (on) {
        ctx.fillStyle = `rgba(${SIGNAL}, 0.14)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${SIGNAL}, 0.5)`;
        ctx.stroke();
        ctx.fillStyle = `rgb(${INK})`;
        ctx.fillText(w.word[i], x + cellW / 2, topY + cellH / 2 + 0.5);
      } else {
        ctx.strokeStyle = `rgba(${INK}, 0.22)`;
        ctx.stroke();
      }
    }

    for (let i = 0; i < m; i++) {
      const x = decX + i * (cellW + gap);
      const on = i < s.phonesShown;
      roundRect(ctx, x, botY, cellW, cellH, 3);
      if (on) {
        ctx.fillStyle = `rgba(${PHON}, 0.15)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${PHON}, 0.5)`;
        ctx.stroke();
        ctx.fillStyle = `rgb(${INK})`;
        ctx.fillText(w.phones[i], x + cellW / 2, botY + cellH / 2 + 0.5);
      } else {
        ctx.strokeStyle = `rgba(${INK}, 0.22)`;
        ctx.stroke();
      }
    }

    if (s.phonesShown > 0 && s.phonesShown <= m && s.charsShown > 0) {
      const di = s.phonesShown - 1;
      const dx = decX + di * (cellW + gap) + cellW / 2;
      const dy = botY;
      const ai = Math.min(n - 1, s.attn * (n - 1));
      const ex = encX + ai * (cellW + gap) + cellW / 2;
      const ey = topY + cellH;
      const midY = topY + (botY - (topY + cellH)) * 0.55 + cellH;

      ctx.strokeStyle = `rgba(${SIGNAL}, 0.55)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.quadraticCurveTo(dx, midY, ex, ey);
      ctx.stroke();

      ctx.fillStyle = `rgba(${SIGNAL}, 0.9)`;
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const { ref } = useCanvasAnimation(
    {
      onResize: () => {
        const s = state.current;
        s.wordIdx = 0;
        s.tick = 0;
        s.charsShown = 0;
        s.phonesShown = 0;
        s.attn = 0;
      },
      onFrame: (ctx, size) => {
        step();
        draw(ctx, size);
      },
      onStatic: (ctx, size) => {
        const s = state.current;
        const w = WORDS[s.wordIdx];
        s.charsShown = w.word.length;
        s.phonesShown = w.phones.length;
        s.attn = 1;
        draw(ctx, size);
      },
    },
    []
  );

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="Live grapheme-to-phoneme sequence-to-sequence model — characters encode, then phonemes decode with attention"
    />
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
