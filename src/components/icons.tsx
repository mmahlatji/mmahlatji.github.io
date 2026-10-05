import type { SVGProps } from 'react';

/* Consistent 24×24 stroke icons, VS Code codicon weight (1.6). */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function FilesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4h6l3 3v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V5.5A1.5 1.5 0 0 1 6.5 4Z" />
      <path d="M15 4v3h3" />
      <path d="M9 5.5V6h6V3.5H9A1.5 1.5 0 0 0 7.5 5v10" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m14.5 14.5 4 4" />
    </svg>
  );
}

export function SourceControlIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="9" r="2" />
      <path d="M6 8v8" />
      <path d="M16 9a7 7 0 0 0-8 0" />
    </svg>
  );
}

export function RunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ExtensionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  );
}

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

export function ChevronIcon({ open, ...props }: SVGProps<SVGSVGElement> & { open?: boolean }) {
  return (
    <svg {...base} {...props} width={16} height={16} style={{ transform: open ? 'rotate(90deg)' : undefined }}>
      <path d="M6 4l5 5-5 5" />
    </svg>
  );
}

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={16} height={16}>
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h4l1.5 2h8A1.5 1.5 0 0 1 18.5 7.5v8A1.5 1.5 0 0 1 17 17H3.5A1.5 1.5 0 0 1 2 15.5Z" />
    </svg>
  );
}

export function FileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={16} height={16}>
      <path d="M5 2h7l4 4v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 17V3.5A1.5 1.5 0 0 1 5.5 2Z" />
      <path d="M12 2v4h4" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={16} height={16}>
      <path d="M6 6l6 6M12 6l-6 6" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={20} height={20}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function BranchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={14} height={14}>
      <circle cx="5" cy="4.5" r="1.5" />
      <circle cx="5" cy="9.5" r="1.5" />
      <circle cx="11" cy="6" r="1.5" />
      <path d="M5 6v2" />
      <path d="M10 6a5 5 0 0 0-4 0" />
    </svg>
  );
}

export function SyncIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={14} height={14}>
      <path d="M18 8a6 6 0 0 0-10.7-3.5L5 7" />
      <path d="M5 3v4h4" />
      <path d="M6 16a6 6 0 0 0 10.7 3.5L19 17" />
      <path d="M19 21v-4h-4" />
    </svg>
  );
}

export function ErrorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={14} height={14}>
      <path d="m8.2 5-3.4 3.4M8.2 8.4 4.8 5" />
    </svg>
  );
}

export function WarnIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={14} height={14}>
      <path d="M12 3 3 12M3 3l9 9" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={14} height={14}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function TerminalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} width={16} height={16}>
      <path d="M4 6l4 4-4 4M10 14h6" />
    </svg>
  );
}
