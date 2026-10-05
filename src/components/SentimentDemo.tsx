import TerminalDemo from './TerminalDemo';
import type { TermLine } from './TerminalDemo';

const TICKERS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'JPM'];

function buildSession(i: number): TermLine[] {
  const ticker = TICKERS[i % TICKERS.length];
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
  return (
    <TerminalDemo
      className={className}
      ariaLabel="Live terminal run of the headline sentiment analyzer — scrapes headlines and scores them with FinBERT"
      buildSession={buildSession}
      sessionCount={TICKERS.length}
      typeMs={20}
      holdMs={1500}
    />
  );
}
