import { useEffect, useRef, useState } from 'react';
import '../styles/TerminalDemo.css';

export type TermKind =
  | 'cmd'
  | 'out'
  | 'info'
  | 'pos'
  | 'neg'
  | 'req'
  | 'res'
  | 'bench'
  | 'dim';

export interface TermLine {
  text: string;
  kind: TermKind;
}

interface TerminalDemoProps {
  className?: string;
  ariaLabel: string;
  /** Builds the lines for one session, given the session index (0-based). */
  buildSession: (index: number) => TermLine[];
  /** Number of distinct sessions to cycle through. */
  sessionCount: number;
  /** ms between each typed character. */
  typeMs?: number;
  /** ms to pause after a full session before starting the next. */
  holdMs?: number;
  /** extra ticks to wait after a command line. */
  cmdWait?: number;
  /** extra ticks to wait after a non-command line. */
  lineWait?: number;
}

export default function TerminalDemo({
  className,
  ariaLabel,
  buildSession,
  sessionCount,
  typeMs = 18,
  holdMs = 1800,
  cmdWait = 6,
  lineWait = 2,
}: TerminalDemoProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState<TermLine[]>([]);
  const [partial, setPartial] = useState('');
  const [partialKind, setPartialKind] = useState<TermKind>('cmd');
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      setReduced(true);
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
      timer = window.setInterval(tick, typeMs);
    };
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const next = () => {
      sessionIdx = (sessionIdx + 1) % sessionCount;
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
        holdTimer = window.setTimeout(next, holdMs);
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
        wait = line.kind === 'cmd' ? cmdWait : lineWait;
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
  }, [buildSession, sessionCount, typeMs, holdMs, cmdWait, lineWait]);

  return (
    <div
      ref={rootRef}
      className={`terminal-demo${className ? ` ${className}` : ''}`}
      role="log"
      aria-label={ariaLabel}
    >
      {rendered.map((line, i) => (
        <div key={i} className={`terminal-demo__line terminal-demo__line--${line.kind}`}>
          {line.text}
        </div>
      ))}
      {!reduced && (
        <div className={`terminal-demo__line terminal-demo__line--${partialKind}`}>
          {partial}
          <span className="caret" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
