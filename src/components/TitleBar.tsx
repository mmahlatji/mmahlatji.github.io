import { MenuIcon } from './icons';
import '../styles/TitleBar.css';

interface TitleBarProps {
  file: string;
  onToggle: () => void;
}

export default function TitleBar({ file, onToggle }: TitleBarProps) {
  return (
    <header className="titlebar">
      <div className="titlebar__left">
        <span className="titlebar__lights" aria-hidden="true">
          <span className="titlebar__light titlebar__light--close" />
          <span className="titlebar__light titlebar__light--min" />
          <span className="titlebar__light titlebar__light--max" />
        </span>
        <button className="titlebar__menu" onClick={onToggle} aria-label="Toggle navigation">
          <MenuIcon />
        </button>
      </div>

      <div className="titlebar__title">
        <span className="titlebar__file">{file}</span>
        <span className="titlebar__sep">—</span>
        <span className="titlebar__folder">moleboheng</span>
      </div>

      <div className="titlebar__right" aria-hidden="true" />
    </header>
  );
}
