import { Link } from 'react-router-dom';
import { getAllPosts, formatDate } from '../lib/posts';
import { usePageTitle } from '../lib/usePageTitle';
import { FileIcon } from '../components/icons';
import '../styles/Blog.css';

export default function Blog() {
  usePageTitle(
    'Notes — Moleboheng Mahlatji',
    'Writing on design, engineering, and building things with intention.'
  );

  const posts = getAllPosts();

  return (
    <div className="blog wrap">
      <header className="blog__head">
        <h1 className="blog__title">
          <span className="md-mark mono" aria-hidden="true"># </span>
          Notes
        </h1>
        <p className="blog__intro">
          Thoughts on design, engineering, and the space in between.
          Infrequent but considered.
        </p>
      </header>

      <ol className="blog__list">
        {posts.length === 0 ? (
          <li className="blog__empty">
            <span className="tok-com mono">// nothing here yet — first post is on the way.</span>
          </li>
        ) : (
          posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="post">
                <div className="post__head">
                  <span className="post__file mono">
                    <FileIcon />
                    {post.slug}.md
                  </span>
                  <span className="post__date mono">{formatDate(post.pubDate)}</span>
                </div>
                <h2 className="post__title">{post.title}</h2>
                <p className="post__desc">{post.description}</p>
                {post.tags.length > 0 && (
                  <ul className="post__tags">
                    {post.tags.map((t) => (
                      <li key={t} className="mono">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
