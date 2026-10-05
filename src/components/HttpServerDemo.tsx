import { useEffect, useRef, useState } from 'react';
import './HttpServerDemo.css';

interface Line {
  text: string;
  kind: 'cmd' | 'info' | 'req' | 'res' | 'dim';
}

const PATHS = ['GET / HTTP/1.1', 'GET /index.html HTTP/1.1', 'HEAD /about.html HTTP/1.1', 'GET /style.css HTTP/1.1'];
const STATUS = ['200 OK', '200 OK', '404 Not Found', '200 OK'];

function buildSession(i: number): Line[] {
  const path = PATHS[i % PATHS.length];
  const status = STATUS[i % STATUS.length];
  return [
    { text: '➜ mvn exec:java', kind: 'cmd' },
    { text: 'INFO  HttpServer - Starting server...', kind: 'info' },
    { text: 'INFO  HttpServer - Using Port: 8080', kind: 'info' },
    { text: 'INFO  HttpServer - Using webroot:', kind: 'info' },
    { text: 'INFO  ServerListenerThread - ***** Connection accepted: /127.0.0.1', kind: 'dim' },
    { text: `INFO  Worker - ${path}`, kind: 'req' },
    { text: `INFO  Worker - ${status}`, kind: 'res' },
    { text: 'INFO  Worker - Connection processing finished.', kind: 'dim' },
  ];
}

export default function HttpServerDemo({ className }: { className?: string }) {
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
      timer = window.setInterval(tick, 18);
    };
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const next = () => {
      sessionIdx = (sessionIdx + 1) % PATHS.length;
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
        holdTimer = window.setTimeout(next, 1800);
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
        wait = line.kind === 'cmd' ? 8 : 2;
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
      className={`server-term${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Live terminal log of the HTTP server — accepts a connection and responds"
    >
      {rendered.map((line, i) => (
        <div key={i} className={`server-term__line server-term__line--${line.kind}`}>
          {line.text}
        </div>
      ))}
      <div className={`server-term__line server-term__line--${partialKind}`}>
        {partial}
        <span className="caret" aria-hidden="true" />
      </div>
    </div>
  );
}
