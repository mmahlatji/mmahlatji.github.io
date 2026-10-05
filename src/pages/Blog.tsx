import { Link } from 'react-router-dom';
import { getAllPosts, formatDate } from '../lib/posts';
import { usePageTitle } from '../lib/usePageTitle';
import './Blog.css';

export default function Blog() {
  usePageTitle(
    'Notes — Moleboheng Mahlatji',
    'Writing on design, engineering, and building things with intention.'
  );

  const posts = getAllPosts();

  return (
    <div className="blog wrap">
      <header className="blog__head">
        <p className="blog__meta mono">field notes</p>
        <h1 className="blog__title">Notes.</h1>
        <p className="blog__intro">
          Thoughts on design, engineering, and the space in between.
          Infrequent but considered.
        </p>
      </header>

      <ol className="blog__list">
        {posts.length === 0 ? (
          <li className="blog__empty">Nothing here yet — first post is on the way.</li>
        ) : (
          posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="post">
                <span className="post__date mono">{formatDate(post.pubDate)}</span>
                <h2 className="post__title">{post.title}</h2>
                <p className="post__desc">{post.description}</p>
                {post.tags.length > 0 && (
                  <ul className="post__tags">
                    {post.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                <span className="post__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
