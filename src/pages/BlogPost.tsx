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
        <h1 className="post-page__title">Not found.</h1>
        <p className="post-page__missing">This note doesn't exist (yet).</p>
        <Link to="/blog" className="back link-underline">
          ← All notes
        </Link>
      </div>
    );
  }

  return (
    <div className="post-page wrap">
      <header className="post-page__head">
        <Link to="/blog" className="back link-underline">
          ← All notes
        </Link>
        <h1 className="post-page__title">{post.title}</h1>
        <div className="post-page__meta">
          <span>{formatDate(post.pubDate)}</span>
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
