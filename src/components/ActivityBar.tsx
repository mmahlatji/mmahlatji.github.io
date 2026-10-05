import { Link } from 'react-router-dom';
import {
  FilesIcon,
  SearchIcon,
  SourceControlIcon,
  RunIcon,
  ExtensionsIcon,
  GearIcon,
} from './icons';
import './ActivityBar.css';

interface ActivityBarProps {
  explorerActive: boolean;
  onToggleExplorer: () => void;
}

export default function ActivityBar({ explorerActive, onToggleExplorer }: ActivityBarProps) {
  return (
    <nav className="activitybar" aria-label="Activity bar">
      <div className="activitybar__group">
        <button
          className={`activitybar__item${explorerActive ? ' is-active' : ''}`}
          onClick={onToggleExplorer}
          aria-label="Explorer"
          title="Explorer (Ctrl+Shift+E)"
        >
          <FilesIcon />
        </button>

        <a className="activitybar__item" href="/#contact" aria-label="Search" title="Search">
          <SearchIcon />
        </a>

        <a
          className="activitybar__item"
          href="https://github.com/mmahlatji"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Source Control"
          title="Source Control"
        >
          <SourceControlIcon />
        </a>

        <a className="activitybar__item" href="/#projects" aria-label="Run and Debug" title="Run and Debug">
          <RunIcon />
        </a>

        <Link className="activitybar__item" to="/blog" aria-label="Extensions" title="Extensions">
          <ExtensionsIcon />
        </Link>
      </div>

      <div className="activitybar__group">
        <a className="activitybar__item" href="/#about" aria-label="Manage" title="Manage">
          <GearIcon />
        </a>
      </div>
    </nav>
  );
}
