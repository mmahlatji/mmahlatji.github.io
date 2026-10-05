import { Link } from 'react-router-dom';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import Timeline from '../components/Timeline';
import SimField from '../components/SimField';
import { projects } from '../data/projects';
import { experience, education, details, tools } from '../data/experience';
import { usePageTitle } from '../lib/usePageTitle';
import './Home.css';

export default function Home() {
  usePageTitle(
    'Moleboheng Mahlatji',
    'Final-year BSc Computer Science & Applied Statistics student at the University of Cape Town, and Computer Science tutor.'
  );

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <SimField
          interactive
          glow
          density={3.2}
          background="#f2f1eb"
          className="hero__field"
          ariaLabel="Live particle field — move your cursor to stir it"
        />
        <div className="wrap hero__inner">
          <p className="hero__meta mono">
            Computer Science &amp; Applied Statistics · UCT
          </p>
          <h1 className="hero__title">
            Moleboheng
            <br />
            Mahlatji<span className="hero__period" aria-hidden="true">.</span>
          </h1>
          <p className="hero__sub">
            Final-year BSc Computer Science &amp; Applied Statistics student at
            the University of Cape Town, and a Computer Science tutor. I write
            software that is quiet, fast, and clear.
          </p>
          <div className="hero__actions">
            <Link to="/#projects" className="btn">
              See my work
            </Link>
            <Link to="/#contact" className="btn btn--ghost">
              Get in touch
            </Link>
          </div>
          <div className="hero__hint">
            <span className="live">
              <span className="live__dot" />
              live simulation
            </span>
            <span className="hero__hint-text">— move your cursor</span>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <Section
        id="about"
        title="Clarity is the feature."
        intro="Final-year BSc student at UCT, CS tutor, and intern-trained developer — curious about how systems work and how to make them clearer."
      >
        <div className="about">
          <div className="about__bio">
            <p>
              I'm in my final year of a BSc in Computer Science and Applied
              Statistics at the University of Cape Town, where I also tutor
              other computer science students.
            </p>
            <p>
              Across a software development internship and a growing set of
              personal projects, I've learned to value clarity over cleverness —
              building things that work and are easy to reason about.
            </p>
            <p>
              These days I'm writing Java and TypeScript, exploring simulation
              and graphics, and documenting what I learn along the way.
            </p>
          </div>

          <aside className="about__aside">
            <dl className="about__details">
              {details.map((d) => (
                <div className="about__detail" key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <div className="about__stack">
              <span className="about__stack-label mono">Stack</span>
              <span className="about__stack-items mono">{tools.join('  ·  ')}</span>
            </div>
          </aside>
        </div>
      </Section>

      {/* ============ EXPERIENCE ============ */}
      <Section
        id="experience"
        title="Where I've worked."
        intro="Teaching, shipping, and learning — a couple of stops on the way."
      >
        <Timeline items={experience} />
      </Section>

      {/* ============ EDUCATION ============ */}
      <Section
        id="education"
        title="What I'm studying."
        intro="Computer Science and Applied Statistics, currently in the final year."
      >
        <Timeline items={education} />
      </Section>

      {/* ============ PROJECTS ============ */}
      <Section
        id="projects"
        title="Things I've shipped."
        intro="A selection of projects — each one running live where it can. All of them taught me something."
      >
        <div className="projects">
          {projects.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.title} />
          ))}
        </div>

        <div className="projects__more">
          <a
            href="https://github.com/wakeupm11y"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            More on GitHub ↗
          </a>
        </div>
      </Section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="section contact">
        <div className="wrap">
          <h2 className="contact__title">
            Let's make something
            <span className="contact__accent"> worth noticing.</span>
          </h2>
          <p className="contact__sub">
            Have a project in mind, or just want to say hi? My inbox is open.
          </p>
          <a href="mailto:hello@moleboheng.dev" className="btn">
            hello@moleboheng.dev
          </a>
        </div>
      </section>
    </>
  );
}
