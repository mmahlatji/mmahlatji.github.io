import { Link } from 'react-router-dom';
import {
  FilesIcon,
  MailIcon,
  SourceControlIcon,
  CubeIcon,
  DocIcon,
} from './icons';
import '../styles/ActivityBar.css';

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
          title="Toggle Explorer"
        >
          <FilesIcon />
          <span className="activitybar__label">Explorer</span>
        </button>

        <Link className="activitybar__item" to="/#contact" title="Contact">
          <MailIcon />
          <span className="activitybar__label">Contact</span>
        </Link>

        <a
          className="activitybar__item"
          href="https://github.com/mmahlatji"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <SourceControlIcon />
          <span className="activitybar__label">GitHub</span>
        </a>

        <Link className="activitybar__item" to="/#projects" title="Projects">
          <CubeIcon />
          <span className="activitybar__label">Projects</span>
        </Link>

        <Link className="activitybar__item" to="/blog" title="Notes">
          <DocIcon />
          <span className="activitybar__label">Notes</span>
        </Link>
      </div>
    </nav>
  );
}
