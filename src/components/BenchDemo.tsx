import { useEffect, useRef, useState } from 'react';
import './BenchDemo.css';

interface Line {
  text: string;
  kind: 'cmd' | 'out' | 'bench' | 'dim';
}

const RUNS: { label: string; median: string }[][] = [
  [
    { label: '[particles=1000]', median: '0.123 ms' },
    { label: '[particles=10000]', median: '1.250 ms' },
    { label: '[particles=100000]', median: '12.401 ms' },
  ],
  [
    { label: '[particles=1000, subSteps=1]', median: '0.210 ms' },
    { label: '[particles=1000, subSteps=2]', median: '0.398 ms' },
    { label: '[particles=10000, subSteps=2]', median: '3.942 ms' },
  ],
];

function buildSession(i: number): Line[] {
  const runs = RUNS[i % RUNS.length];
  const lines: Line[] = [
    { text: '➜ bench list', kind: 'cmd' },
    { text: 'physics-step', kind: 'out' },
    { text: 'check-collisions', kind: 'out' },
    { text: '➜ bench run physics-step', kind: 'cmd' },
  ];
  for (const r of runs) {
    lines.push({
      text: `manybench.generated.PhysicsStepBenchmark.physics_step  ${r.label}  median ${r.median}`,
      kind: 'bench',
    });
  }
  lines.push({ text: '✓ done in 3.2s', kind: 'dim' });
  return lines;
}

export default function BenchDemo({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState<Line[]>([]);
  const [partial, setPartial] = useState('');
  const [partialKind, setPartialKind] = useState<Line['kind']>('cmd');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setRendered(buildSession(0));
      setPartial('');
      return;
    }

    let script = buildSession(0);
    let sessionIdx = 0;
    let lineIdx = 0;
    let charIdx = 0;
    let wait = 0;
    let timer = 0;
    let holdTimer = 0;
    let visible = true;

    const start = () => {
      if (timer || !visible || document.hidden) return;
      timer = window.setInterval(tick, 16);
    };
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const next = () => {
      sessionIdx = (sessionIdx + 1) % RUNS.length;
      script = buildSession(sessionIdx);
      lineIdx = 0;
      charIdx = 0;
      wait = 0;
      setRendered([]);
      setPartial('');
      setPartialKind('cmd');
      start();
    };

    const tick = () => {
      if (wait > 0) {
        wait--;
        return;
      }
      const line = script[lineIdx];
      if (!line) {
        stop();
        holdTimer = window.setTimeout(next, 2200);
        return;
      }
      if (charIdx < line.text.length) {
        charIdx++;
        setPartial(line.text.slice(0, charIdx));
        setPartialKind(line.kind);
      } else {
        setRendered((p) => [...p, line]);
        setPartial('');
        lineIdx++;
        charIdx = 0;
        wait = line.kind === 'cmd' ? 6 : 1;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) start();
        else stop();
      },
      { rootMargin: '100px' }
    );
    io.observe(root);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    start();

    return () => {
      stop();
      if (holdTimer) window.clearTimeout(holdTimer);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`bench-term${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Live terminal run of ManyBench — discovers and benchmarks a Java routine with JMH"
    >
      {rendered.map((line, i) => (
        <div key={i} className={`bench-term__line bench-term__line--${line.kind}`}>
          {line.text}
        </div>
      ))}
      <div className={`bench-term__line bench-term__line--${partialKind}`}>
        {partial}
        <span className="caret" aria-hidden="true" />
      </div>
    </div>
  );
}
