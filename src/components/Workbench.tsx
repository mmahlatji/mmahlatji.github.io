import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import { CloseIcon, FileIcon, FolderIcon } from './icons';
import { useActiveSection, fileForLocation } from '../lib/sections';
import '../styles/Workbench.css';

export default function Workbench({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 900px)').matches
      : true
  );
  const toggle = useCallback(() => setSidebarOpen((v) => !v), []);
  const { pathname } = useLocation();
  const section = useActiveSection();
  const file = fileForLocation(pathname, section);
  const isNotes = pathname === '/blog' || pathname.startsWith('/blog/');

  const [lastHome, setLastHome] = useState('top');
  useEffect(() => {
    if (!isNotes) setLastHome(section);
  }, [isNotes, section]);

  const homeFile = fileForLocation('/', lastHome);
  const homeHref = lastHome === 'top' ? '/' : `/#${lastHome}`;

  return (
    <div className={`workbench${sidebarOpen ? '' : ' sidebar-closed'}`}>
      <TitleBar file={file.name} onToggle={toggle} />
      <ActivityBar explorerActive={sidebarOpen} onToggleExplorer={toggle} />
      <Sidebar open={sidebarOpen} onClose={toggle} activeFile={file} activeSection={section} />

      <main className="editor">
        <div className="editor__tabs">
          <Link to={homeHref} className={`editor__tab${isNotes ? '' : ' is-active'}`}>
            <span className="editor__tab-icon">
              {homeFile.folder ? <FolderIcon /> : <FileIcon />}
            </span>
            <span className="editor__tab-name mono">{homeFile.name}</span>
            <span className="editor__tab-close" aria-hidden="true">
              <CloseIcon />
            </span>
          </Link>
          <Link to="/blog" className={`editor__tab${isNotes ? ' is-active' : ''}`}>
            <span className="editor__tab-icon">
              <FileIcon />
            </span>
            <span className="editor__tab-name mono">notes.md</span>
            <span className="editor__tab-close" aria-hidden="true">
              <CloseIcon />
            </span>
          </Link>
          <div className="editor__tabs-spacer" />
        </div>
        <div className="editor__crumbs mono" role="navigation" aria-label="Breadcrumbs">
          <span className="editor__crumb-sep" aria-hidden="true">›</span>
          <span>moleboheng</span>
          <span className="editor__crumb-sep" aria-hidden="true">›</span>
          <span>src</span>
          <span className="editor__crumb-sep" aria-hidden="true">›</span>
          <span className="editor__crumb-current">{file.name}</span>
        </div>
        <div className="editor__content">{children}</div>
      </main>

      <StatusBar file={file.lang} />

      <button
        className={`workbench__scrim${sidebarOpen ? ' is-open' : ''}`}
        onClick={toggle}
        aria-label="Close sidebar"
        tabIndex={-1}
      />
    </div>
  );
}
