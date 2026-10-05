import { useState } from 'react';
import type { ReactNode } from 'react';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import CodeBlock from '../components/CodeBlock';
import { ArrowUpRightIcon } from '../components/icons';
import { projects } from '../data/projects';
import { experience, education, details, tools } from '../data/experience';
import { usePageTitle } from '../lib/usePageTitle';
import { highlight } from '../lib/highlight';
import '../styles/Home.css';

const esc = (s: string) => s.replace(/"/g, '\\"');

/* ---- hero: profile.ts ---- */
const profileSrc = `// Moleboheng Mahlatji — who I am, at a glance
// Final-year BSc Computer Science & Applied Statistics @ UCT

const me: Engineer = {
  name: "Moleboheng Mahlatji",
  location: "Cape Town, ZA",
  currently: "CS Tutor @ UCT",
  building: ["simulations", "graphics", "systems"],
  principle: "The man who says he can and the man who says he can't are both correct"
};

const links = {
  github: "github.com/mmahlatji",
  linkedin: "linkedin.com/in/molebohengmahlatji",
  email: "molebohengmahlatji@gmail.com",
};`;

const profileLines: ReactNode[] = (() => {
  const lines = highlight(profileSrc);
  const last = lines[lines.length - 1];
  lines[lines.length - 1] = (
    <span key="last">
      {last}
      <span className="caret" aria-hidden="true" />
    </span>
  );
  return lines;
})();

/* ---- about: details + stack ---- */
const detailsSrc = `const details = {
${details.map((d) => `  ${d.label.toLowerCase()}: "${esc(d.value)}",`).join('\n')}
};

const stack = [${tools.map((t) => `"${t}"`).join(', ')}];`;

const detailsLines = highlight(detailsSrc);

/* ---- timeline: experience/education as code ---- */
function timelineSource(
  varName: string,
  typeName: string,
  items: { period: string; role: string; company: string; description: string }[]
): string {
  const body = items
    .map(
      (item) => `  {
    role: "${esc(item.role)}",
    company: "${esc(item.company)}",
    period: "${esc(item.period)}",
    note: "${esc(item.description)}"
  }`
    )
    .join(',\n');
  return `const ${varName}: ${typeName}[] = [
${body}
];`;
}

const experienceLines = highlight(timelineSource('experience', 'Experience', experience));
const educationLines = highlight(timelineSource('education', 'Education', education));

export default function Home() {
  usePageTitle(
    'Moleboheng Mahlatji',
    'Final-year BSc Computer Science & Applied Statistics student at the University of Cape Town, and Computer Science tutor.'
  );

  const [copied, setCopied] = useState(false);
  const EMAIL = 'molebohengmahlatji@gmail.com';
  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        const ta = document.createElement('textarea');
        ta.value = EMAIL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero" id="top">
        <div className="wrap">
          <h1 className="hero__title">
            <span className="md-mark mono" aria-hidden="true"># </span>
            Moleboheng <span className="hero__ln">Mahlatji</span>
          </h1>
          <p className="hero__sub">
            Final-year BSc Computer Science &amp; Applied Statistics student at
            the University of Cape Town, and a Computer Science tutor.
          </p>

          <div className="hero__decl mono">
            <span className="hero__decl-prompt">➜</span>
            {highlight('const me: Engineer = { currently: "CS Tutor @ UCT", principle: "The man who says he can and the man who says he can\'t are both correct" };')}
          </div>

          <details className="hero__file">
            <summary className="hero__file-summary mono">
              <span className="hero__file-chevron">▸</span>
              <span>profile.ts</span>
              <span className="hero__file-hint" />
            </summary>
            <CodeBlock
              lines={profileLines}
              filename="profile.ts"
              lang="TypeScript"
              className="hero__file-code"
            />
          </details>

          <div className="hero__actions">
            <a href="#projects" className="btn">
              See my work
            </a>
            <a href="#contact" className="btn btn--ghost">
              Get in touch
            </a>
          </div>

          <div className="hero__hint">
            <span className="live">
              <span className="live__dot" />
              the demos below are running
            </span>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <Section
        id="about"
        title="About me."
        intro="A quick background, and the tools I use."
      >
        <div className="about">
          <div className="about__bio">
            <p>
              I build simulations and graphics — the kind of software you can
              run and watch. You can try them in the projects below.
            </p>
            <p>
              An internship at Reslocate taught me to work inside a real
              codebase: review, ship, and keep the code readable.
            </p>
            <p>
              These days I write mostly Java and TypeScript.
            </p>
          </div>

          <CodeBlock lines={detailsLines} filename="about.ts" lang="TypeScript" className="about__code" />
        </div>
      </Section>

      {/* ============ EXPERIENCE ============ */}
      <Section
        id="experience"
        title="Where I've worked."
        intro="Teaching, shipping, and learning — a couple of stops on the way."
      >
        <CodeBlock
          lines={experienceLines}
          filename="experience.ts"
          lang="TypeScript"
        />
      </Section>

      {/* ============ EDUCATION ============ */}
      <Section
        id="education"
        title="What I'm studying."
        intro="Computer Science and Applied Statistics, currently in the final year."
      >
        <CodeBlock
          lines={educationLines}
          filename="education.ts"
          lang="TypeScript"
        />
      </Section>

      {/* ============ PROJECTS ============ */}
      <Section
        id="projects"
        title="Things I've shipped."
        intro="A selection of projects that have each taught me something."
      >
        <div className="projects">
          {projects.map((p) => (
            <ProjectCard project={p} key={p.slug} />
          ))}
        </div>

        <div className="projects__more">
          <a
            href="https://github.com/mmahlatji"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            More on GitHub <ArrowUpRightIcon />
          </a>
        </div>
      </Section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="contact">
        <div className="wrap">
          <h2 className="contact__title">
            <span className="md-mark mono" aria-hidden="true">## </span>
            Let's make something{' '}
            <span className="contact__accent">worth noticing.</span>
          </h2>
          <p className="contact__sub">
            Have a project in mind, or just want to say hi? My inbox is open.
          </p>

          <div className="terminal">
            <div className="terminal__head">
              <span className="terminal__lights" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="terminal__name mono">zsh — moleboheng</span>
            </div>
            <div className="terminal__body">
              <p className="terminal__line">
                <span className="terminal__prompt mono">➜ ~</span>
                <span>
                  git clone{' '}
                  <a href="https://github.com/mmahlatji" target="_blank" rel="noopener noreferrer" className="terminal__mail">
                    github.com/mmahlatji
                  </a>
                </span>
              </p>
              <p className="terminal__line">
                <span className="terminal__prompt mono">➜ ~</span>
                <span>
                  <a href="https://www.linkedin.com/in/molebohengmahlatji/" target="_blank" rel="noopener noreferrer" className="terminal__mail">
                    linkedin.com/in/molebohengmahlatji
                  </a>
                </span>
              </p>
              <p className="terminal__line">
                <span className="terminal__prompt mono">➜ ~</span>
                <span>
                  mail{' '}
                  <a className="terminal__mail" href="mailto:molebohengmahlatji@gmail.com">
                    molebohengmahlatji@gmail.com
                  </a>
                </span>
                <button
                  type="button"
                  className="terminal__copy"
                  onClick={copyEmail}
                  aria-live="polite"
                >
                  {copied ? 'copied ✓' : 'copy'}
                </button>
                <span className="caret" aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
