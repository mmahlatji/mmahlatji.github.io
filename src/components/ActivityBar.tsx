import { Link } from 'react-router-dom';
import {
  FilesIcon,
  SearchIcon,
  SourceControlIcon,
  RunIcon,
  ExtensionsIcon,
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
          title="Explorer"
        >
          <FilesIcon />
        </button>

        <a className="activitybar__item" href="/#contact" aria-label="Contact" title="Contact">
          <SearchIcon />
        </a>

        <a
          className="activitybar__item"
          href="https://github.com/mmahlatji"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <SourceControlIcon />
        </a>

        <a className="activitybar__item" href="/#projects" aria-label="Projects" title="Projects">
          <RunIcon />
        </a>

        <Link className="activitybar__item" to="/blog" aria-label="Notes" title="Notes">
          <ExtensionsIcon />
        </Link>
      </div>
    </nav>
  );
}
