import TerminalDemo from './TerminalDemo';
import type { TermLine } from './TerminalDemo';

const PATHS = ['GET / HTTP/1.1', 'GET /index.html HTTP/1.1', 'HEAD /about.html HTTP/1.1', 'GET /style.css HTTP/1.1'];
const STATUS = ['200 OK', '200 OK', '404 Not Found', '200 OK'];

function buildSession(i: number): TermLine[] {
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
  return (
    <TerminalDemo
      className={className}
      ariaLabel="Live terminal log of the HTTP server — accepts a connection and responds"
      buildSession={buildSession}
      sessionCount={PATHS.length}
      typeMs={18}
      holdMs={1800}
      cmdWait={8}
    />
  );
}
