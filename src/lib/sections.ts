import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from '../data/projects';
import type { FileKind } from '../data/projects';

export type { FileKind };

export interface ActiveFile {
  name: string;
  lang: string;
  kind: FileKind;
  folder?: boolean;
}

const LANG: Record<FileKind, string> = {
  md: 'Markdown',
  ts: 'TypeScript',
  tsx: 'TypeScript React',
  py: 'Python',
  java: 'Java',
};

/* One source of truth: scroll-spy section id -> the file it represents. */
export const HOME_FILES: Record<string, ActiveFile> = {
  top: { name: 'profile.ts', lang: LANG.ts, kind: 'ts' },
  about: { name: 'about.ts', lang: LANG.ts, kind: 'ts' },
  experience: { name: 'experience.ts', lang: LANG.ts, kind: 'ts' },
  education: { name: 'education.ts', lang: LANG.ts, kind: 'ts' },
  projects: { name: 'projects', lang: 'Folder', kind: 'ts', folder: true },
};

for (const p of projects) {
  HOME_FILES[`project-${p.slug}`] = { name: p.file, lang: LANG[p.kind], kind: p.kind };
}

HOME_FILES.contact = { name: 'contact.md', lang: LANG.md, kind: 'md' };

export const HOME_SECTIONS = Object.keys(HOME_FILES);

export function useActiveSection(): string {
  const [active, setActive] = useState('top');
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') {
      setActive('top');
      return;
    }

    const compute = () => {
      const marker = window.innerHeight * 0.32;
      let current = 'top';
      for (const id of HOME_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= marker) current = id;
      }
      setActive(current);
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [pathname]);

  return active;
}

export function fileForLocation(pathname: string, section: string): ActiveFile {
  if (pathname === '/blog') return { name: 'notes.md', lang: LANG.md, kind: 'md' };
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.split('/').pop();
    return { name: `${slug}.md`, lang: LANG.md, kind: 'md' };
  }
  return HOME_FILES[section] ?? HOME_FILES.top;
}
