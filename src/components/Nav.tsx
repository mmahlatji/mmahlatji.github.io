import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

const links = [
  { to: '/#about', label: 'About' },
  { to: '/#experience', label: 'Experience' },
  { to: '/#projects', label: 'Projects' },
  { to: '/blog', label: 'Notes' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <Link to="/" className="nav__brand">
        <span className="nav__mark" aria-hidden="true" />
        <span className="nav__name">Moleboheng&nbsp;Mahlatji</span>
      </Link>

      <nav className="nav__links" aria-label="Primary">
        {links.map((l) => (
          <Link key={l.label} to={l.to} className="nav__link">
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="nav__right">
        <span className="live nav__live" aria-hidden="true">
          <span className="live__dot" />
          simulating
        </span>
        <Link to="/#contact" className="btn btn--nav">
          Contact
        </Link>
      </div>
    </header>
  );
}
