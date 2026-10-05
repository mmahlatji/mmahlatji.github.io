import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import { CloseIcon, FileIcon, FolderIcon } from './icons';
import { useActiveSection, fileForLocation } from '../lib/sections';
import './Workbench.css';

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

  return (
    <div className={`workbench${sidebarOpen ? '' : ' sidebar-closed'}`}>
      <TitleBar file={file.name} onToggle={toggle} />
      <ActivityBar explorerActive={sidebarOpen} onToggleExplorer={toggle} />
      <Sidebar open={sidebarOpen} onClose={toggle} activeFile={file} />

      <main className="editor">
        <div className="editor__tabs">
          <div className="editor__tab is-active" role="tab" aria-selected="true">
            <span className="editor__tab-icon">
              {file.folder ? <FolderIcon /> : <FileIcon />}
            </span>
            <span className="editor__tab-name mono">{file.name}</span>
            <button className="editor__tab-close" aria-label={`Close ${file.name}`} tabIndex={-1}>
              <CloseIcon />
            </button>
          </div>
          <div className="editor__tabs-spacer" />
        </div>
        <div className="editor__crumbs mono" aria-label="Breadcrumbs">
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
