import { Link } from 'react-router-dom';
import './Footer.css';

const year = new Date().getFullYear();

const socials = [
  { label: 'GitHub', href: 'https://github.com/wakeupm11y' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/molebohengmahlatji/' },
  { label: 'Email', href: 'mailto:molebohengmahlatji@gmail.com' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__top">
          <Link to="/" className="footer__brand">
            <span className="footer__mark" aria-hidden="true" />
            Moleboheng Mahlatji
          </Link>
          <span className="footer__tag mono">field state: running</span>
        </div>

        <div className="footer__grid">
          <nav className="footer__col" aria-label="Footer">
            <span className="footer__label mono">Menu</span>
            <Link to="/#about">About</Link>
            <Link to="/#experience">Experience</Link>
            <Link to="/#projects">Projects</Link>
            <Link to="/blog">Notes</Link>
          </nav>

          <nav className="footer__col" aria-label="Socials">
            <span className="footer__label mono">Elsewhere</span>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© {year} Moleboheng Mahlatji</span>
          <span className="footer__mono mono">/ cape town, sa</span>
        </div>
      </div>
    </footer>
  );
}
