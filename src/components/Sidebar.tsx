import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronIcon, FolderIcon, FileIcon, CloseIcon } from './icons';
import { useActiveSection } from '../lib/sections';
import type { ActiveFile } from '../lib/sections';
import './Sidebar.css';

type Entry =
  | { kind: 'folder'; label: string; section?: string; children: Entry[] }
  | { kind: 'file'; label: string; type: 'md' | 'ts' | 'tsx' | 'py' | 'java'; href: string; section?: string; route?: boolean };

const TREE: Entry[] = [
  { kind: 'file', label: 'profile.ts', type: 'ts', href: '/', section: 'top' },
  { kind: 'file', label: 'about.ts', type: 'ts', href: '/#about', section: 'about' },
  { kind: 'file', label: 'experience.ts', type: 'ts', href: '/#experience', section: 'experience' },
  { kind: 'file', label: 'education.ts', type: 'ts', href: '/#education', section: 'education' },
  {
    kind: 'folder',
    label: 'projects',
    section: 'projects',
    children: [
      { kind: 'file', label: 'flip-water.ts', type: 'ts', href: '/#project-flip-water', section: 'project-flip-water' },
      { kind: 'file', label: 'ray-tracer.ts', type: 'ts', href: '/#project-ray-tracer', section: 'project-ray-tracer' },
      { kind: 'file', label: 'admit.ts', type: 'ts', href: '/#project-admit', section: 'project-admit' },
      { kind: 'file', label: 'sentiment.py', type: 'py', href: '/#project-sentiment', section: 'project-sentiment' },
      { kind: 'file', label: 'httpserver.java', type: 'java', href: '/#project-http-server', section: 'project-http-server' },
      { kind: 'file', label: 'manybench.py', type: 'py', href: '/#project-manybench', section: 'project-manybench' },
    ],
  },
  { kind: 'file', label: 'notes.md', type: 'md', href: '/blog', route: true },
  { kind: 'file', label: 'contact.md', type: 'md', href: '/#contact', section: 'contact' },
];

function TreeRow({ entry, depth, active }: { entry: Entry; depth: number; active: string }) {
  const [open, setOpen] = useState(true);

  if (entry.kind === 'file') {
    const isActive = entry.section === active || (entry.route && active === 'notes');
    return (
      <Link
        to={entry.href}
        className={`tree__file${isActive ? ' is-active' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 10}px` }}
      >
        <span className={`tree__file-icon tree__file-icon--${entry.type}`}>
          <FileIcon />
        </span>
        <span className="tree__file-label">{entry.label}</span>
      </Link>
    );
  }

  const isActive = entry.section === active;
  return (
    <>
      <button
        className={`tree__folder${isActive ? ' is-active' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 6}px` }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <ChevronIcon open={open} className="tree__chevron" />
        <FolderIcon className="tree__folder-icon" />
        <span className="tree__folder-label">{entry.label}</span>
      </button>
      {open &&
        entry.children.map((child) => (
          <TreeRow key={child.label} entry={child} depth={depth + 1} active={active} />
        ))}
    </>
  );
}

export default function Sidebar({
  open,
  onClose,
  activeFile,
}: {
  open: boolean;
  onClose: () => void;
  activeFile: ActiveFile;
}) {
  const activeSection = useActiveSection();
  const { pathname } = useLocation();
  const active = pathname === '/' ? activeSection : 'notes';
  const fileType = activeFile.kind;
  const isFolder = activeFile.folder;

  return (
    <aside className={`sidebar${open ? ' is-open' : ''}`}>
      <div className="sidebar__head">
        <button className="sidebar__head-chevron" onClick={onClose} aria-label="Collapse Explorer">
          <ChevronIcon />
        </button>
        <span className="sidebar__label">Explorer</span>
        <span className="sidebar__head-actions" aria-hidden="true">
          ···
        </span>
      </div>

      <div className="sidebar__tree" role="navigation" aria-label="File explorer">
        <div className="sidebar__section">
          <div className="sidebar__section-head">
            <ChevronIcon open className="sidebar__section-chevron" />
            <span>Open Editors</span>
          </div>
          <Link to={pathname} className="tree__file is-active" style={{ paddingLeft: '26px' }}>
            <span className={`tree__file-icon tree__file-icon--${fileType}`}>
              {isFolder ? <FolderIcon /> : <FileIcon />}
            </span>
            <span className="tree__file-label">{activeFile.name}</span>
            <CloseIcon className="tree__file-close" />
          </Link>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__section-head">
            <ChevronIcon open className="sidebar__section-chevron" />
            <span>MOLEBOHENG</span>
          </div>
          {TREE.map((entry) => (
            <TreeRow key={entry.label} entry={entry} depth={1} active={active} />
          ))}
        </div>
      </div>

      <div className="sidebar__foot">
        <span className="live">
          <span className="live__dot" />
          simulating
        </span>
      </div>

      <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
        ×
      </button>
    </aside>
  );
}
