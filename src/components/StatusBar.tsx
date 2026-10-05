import { BranchIcon, SyncIcon, ErrorIcon, WarnIcon } from './icons';
import './StatusBar.css';

export default function StatusBar({ file }: { file: string }) {
  return (
    <footer className="statusbar">
      <div className="statusbar__group">
        <span className="statusbar__item">
          <BranchIcon />
          <span>vsc</span>
        </span>
        <span className="statusbar__item" title="Synchronize">
          <SyncIcon />
          <span>0↓ 0↑</span>
        </span>
        <span className="statusbar__item" title="No errors">
          <ErrorIcon />
          <span>0</span>
        </span>
        <span className="statusbar__item" title="No warnings">
          <WarnIcon />
          <span>0</span>
        </span>
      </div>

      <div className="statusbar__group statusbar__group--right">
        <span className="statusbar__item live statusbar__live" aria-hidden="true">
          <span className="live__dot" />
          <span>simulating</span>
        </span>
        <span className="statusbar__item">{file}</span>
        <span className="statusbar__item">Ln 1, Col 1</span>
        <span className="statusbar__item">Spaces: 2</span>
        <span className="statusbar__item">UTF-8</span>
        <span className="statusbar__item">LF</span>
      </div>
    </footer>
  );
}
