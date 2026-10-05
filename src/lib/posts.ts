export interface Post {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  draft: boolean;
  content: string;
}

interface Frontmatter {
  [key: string]: string | undefined;
}

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const body = raw.slice(match[0].length);
  const data: Frontmatter = {};

  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) data[key] = value;
  }

  return { data, body };
}

function parseTags(value?: string): string[] {
  if (!value) return [];
  const inner = value.replace(/^\[|\]$/g, '').trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function loadPosts(): Post[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace(/\.md$/, '');
      const { data, body } = parseFrontmatter(raw as string);

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        pubDate: new Date(data.pubDate ?? Date.now()),
        updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
        tags: parseTags(data.tags),
        draft: data.draft === 'true',
        content: body.trim(),
      } as Post;
    })
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

const ALL_POSTS = loadPosts();

export function getAllPosts(): Post[] {
  return ALL_POSTS.filter((p) => !p.draft);
}

export function getPost(slug: string): Post | undefined {
  return ALL_POSTS.find((p) => p.slug === slug && !p.draft);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
