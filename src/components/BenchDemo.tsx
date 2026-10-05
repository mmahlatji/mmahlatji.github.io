import TerminalDemo from './TerminalDemo';
import type { TermLine } from './TerminalDemo';

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

function buildSession(i: number): TermLine[] {
  const runs = RUNS[i % RUNS.length];
  const lines: TermLine[] = [
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
  return (
    <TerminalDemo
      className={className}
      ariaLabel="Live terminal run of ManyBench — discovers and benchmarks a Java routine with JMH"
      buildSession={buildSession}
      sessionCount={RUNS.length}
      typeMs={16}
      holdMs={2200}
      lineWait={1}
    />
  );
}
