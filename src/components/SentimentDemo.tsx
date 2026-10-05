import { useEffect, useRef, useState } from 'react';
import './SentimentDemo.css';

interface Line {
  text: string;
  kind: 'cmd' | 'out' | 'pos' | 'neg';
}

const TICKERS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'JPM'];

function buildSession(ticker: string): Line[] {
  const sentiment = Math.round((Math.random() * 2 - 1) * 100) / 100;
  const change = Math.round((Math.random() * 6 - 3) * 10) / 10;
  const s = sentiment >= 0 ? `+${sentiment.toFixed(2)}` : sentiment.toFixed(2);
  const c = change >= 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
  return [
    { text: '➜ python main.py', kind: 'cmd' },
    { text: `ticker: ${ticker}`, kind: 'out' },
    { text: 'period: 1mo', kind: 'out' },
    { text: 'scraping headlines… 128 fetched', kind: 'out' },
    { text: 'finbert: analyzing… done', kind: 'out' },
    {
      text: `${ticker}   avg=${s}   open→close ${c}%`,
      kind: sentiment >= 0 ? 'pos' : 'neg',
    },
  ];
}

export default function SentimentDemo({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState<Line[]>([]);
  const [partial, setPartial] = useState('');
  const [partialKind, setPartialKind] = useState<Line['kind']>('cmd');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setRendered(buildSession(TICKERS[0]));
      setPartial('');
      return;
    }

    let script = buildSession(TICKERS[0]);
    let sessionIdx = 0;
    let lineIdx = 0;
    let charIdx = 0;
    let wait = 0;
    let timer = 0;
    let holdTimer = 0;
    let visible = true;

    const start = () => {
      if (timer || !visible || document.hidden) return;
      timer = window.setInterval(tick, 20);
    };
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const next = () => {
      sessionIdx = (sessionIdx + 1) % TICKERS.length;
      script = buildSession(TICKERS[sessionIdx]);
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
        holdTimer = window.setTimeout(next, 1500);
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
        wait = line.kind === 'cmd' ? 6 : 2;
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
      className={`sentiment-term${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Live terminal run of the headline sentiment analyzer — scrapes headlines and scores them with FinBERT"
    >
      {rendered.map((line, i) => (
        <div key={i} className={`sentiment-term__line sentiment-term__line--${line.kind}`}>
          {line.text}
        </div>
      ))}
      <div className={`sentiment-term__line sentiment-term__line--${partialKind}`}>
        {partial}
        <span className="caret" aria-hidden="true" />
      </div>
    </div>
  );
}
