import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronIcon, FolderIcon, FileIcon, CloseIcon } from './icons';
import type { ActiveFile } from '../lib/sections';
import { projects } from '../data/projects';
import '../styles/Sidebar.css';

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
    children: projects.map((p) => ({
      kind: 'file',
      label: p.file,
      type: p.kind,
      href: `/#project-${p.slug}`,
      section: `project-${p.slug}`,
    })),
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

  const childActive = entry.children.some(
    (c) => c.kind === 'file' && c.section === active
  );
  const isActive = entry.section === active || childActive;
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
  activeSection,
}: {
  open: boolean;
  onClose: () => void;
  activeFile: ActiveFile;
  activeSection: string;
}) {
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

      <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
        ×
      </button>
    </aside>
  );
}
