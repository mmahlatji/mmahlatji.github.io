import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPost, formatDate } from '../lib/posts';
import { usePageTitle } from '../lib/usePageTitle';
import './BlogPost.css';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  usePageTitle(
    post ? `${post.title} — Moleboheng Mahlatji` : 'Not found',
    post?.description
  );

  if (!post) {
    return (
      <div className="post-page wrap">
        <h1 className="post-page__title">
          <span className="md-mark mono" aria-hidden="true"># </span>
          Not found.
        </h1>
        <p className="post-page__missing">
          <span className="tok-com mono">// this note doesn't exist (yet).</span>
        </p>
        <Link to="/blog" className="back mono">
          ← notes.md
        </Link>
      </div>
    );
  }

  return (
    <div className="post-page wrap">
      <header className="post-page__head">
        <Link to="/blog" className="back mono">
          ← notes.md
        </Link>
        <h1 className="post-page__title">
          <span className="md-mark mono" aria-hidden="true"># </span>
          {post.title}
        </h1>
        <div className="post-page__meta mono">
          <span>{formatDate(post.pubDate)}</span>
          <span className="post-page__sep" aria-hidden="true">·</span>
          <span>{post.slug}.md</span>
          {post.tags.length > 0 && (
            <ul className="post-page__tags">
              {post.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <article className="prose">
        <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
      </article>
    </div>
  );
}
