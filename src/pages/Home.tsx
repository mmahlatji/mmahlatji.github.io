import type { ReactNode } from 'react';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import CodeBlock from '../components/CodeBlock';
import { ArrowUpRightIcon } from '../components/icons';
import { projects } from '../data/projects';
import { experience, education, details, tools } from '../data/experience';
import { usePageTitle } from '../lib/usePageTitle';
import './Home.css';

const esc = (s: string) => s.replace(/"/g, '\\"');

/* ---- hero: profile.ts ---- */
const profileLines: ReactNode[] = [
  <>
    <span className="tok-com">// Moleboheng Mahlatji — who I am, at a glance</span>
  </>,
  <>
    <span className="tok-com">// Final-year BSc Computer Science &amp; Applied Statistics @ UCT</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className="tok-kw">const</span> <span className="tok-var">me</span>
    <span className="tok-punct">: </span>
    <span className="tok-type">Engineer</span>
    <span className="tok-punct"> = {'{'}</span>
  </>,
  <>
    {'  '}<span className="tok-prop">name</span><span className="tok-punct">:</span>{' '}
    <span className="tok-str">"Moleboheng Mahlatji"</span><span className="tok-punct">,</span>
  </>,
  <>
    {'  '}<span className="tok-prop">location</span><span className="tok-punct">:</span>{' '}
    <span className="tok-str">"Cape Town, ZA"</span><span className="tok-punct">,</span>
  </>,
  <>
    {'  '}<span className="tok-prop">currently</span><span className="tok-punct">:</span>{' '}
    <span className="tok-str">"CS Tutor @ UCT"</span><span className="tok-punct">,</span>
  </>,
  <>
    {'  '}<span className="tok-prop">building</span><span className="tok-punct">:</span>{' '}
    <span className="tok-punct">[</span>
    <span className="tok-str">"simulations"</span><span className="tok-punct">,</span>{' '}
    <span className="tok-str">"graphics"</span><span className="tok-punct">,</span>{' '}
    <span className="tok-str">"systems"</span>
    <span className="tok-punct">],</span>
  </>,
  <>
    {'  '}<span className="tok-prop">principle</span><span className="tok-punct">:</span>{' '}
    <span className="tok-str">"quiet, fast, clear software"</span>
  </>,
  <>
    <span className="tok-punct">{'}'}</span><span className="tok-punct">;</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className="tok-kw">const</span> <span className="tok-var">links</span>
    <span className="tok-punct"> = {'{'}</span>
  </>,
  <>
    {'  '}<span className="tok-prop">github</span><span className="tok-punct">:</span>{' '}
    <span className="tok-str">"github.com/mmahlatji"</span><span className="tok-punct">,</span>
  </>,
  <>
    {'  '}<span className="tok-prop">linkedin</span><span className="tok-punct">:</span>{' '}
    <span className="tok-str">"linkedin.com/in/molebohengmahlatji"</span><span className="tok-punct">,</span>
  </>,
  <>
    {'  '}<span className="tok-prop">email</span><span className="tok-punct">:</span>{' '}
    <span className="tok-str">"molebohengmahlatji@gmail.com"</span><span className="tok-punct">,</span>
  </>,
  <>
    <span className="tok-punct">{'}'}</span><span className="tok-punct">;</span>
    <span className="caret" aria-hidden="true" />
  </>,
];

/* ---- about: details + stack ---- */
const detailsLines: ReactNode[] = [
  <>
    <span className="tok-kw">const</span> <span className="tok-var">details</span>
    <span className="tok-punct"> = {'{'}</span>
  </>,
  ...details.map((d) => (
    <>
      {'  '}<span className="tok-prop">{d.label.toLowerCase()}</span>
      <span className="tok-punct">:</span>{' '}
      <span className="tok-str">"{esc(d.value)}"</span><span className="tok-punct">,</span>
    </>
  )),
  <>
    <span className="tok-punct">{'}'}</span><span className="tok-punct">;</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className="tok-kw">const</span> <span className="tok-var">stack</span>
    <span className="tok-punct"> = </span>
    <span className="tok-punct">[</span>
    {tools.map((t, i) => (
      <>
        <span className="tok-str">"{t}"</span>
        {i < tools.length - 1 ? <span className="tok-punct">, </span> : null}
      </>
    ))}
    <span className="tok-punct">];</span>
  </>,
];

/* ---- timeline: experience/education as code ---- */
function timelineLines(
  varName: string,
  typeName: string,
  items: { period: string; role: string; company: string; description: string }[]
): ReactNode[] {
  const lines: ReactNode[] = [
    <>
      <span className="tok-kw">const</span> <span className="tok-var">{varName}</span>
      <span className="tok-punct">: </span>
      <span className="tok-type">{typeName}</span>
      <span className="tok-punct">[]</span>
      <span className="tok-punct"> = [</span>
    </>,
  ];
  items.forEach((item, i) => {
    lines.push(
      <>{'  '}<span className="tok-punct">{'{'}</span></>,
      <>
        {'    '}<span className="tok-prop">role</span><span className="tok-punct">:</span>{' '}
        <span className="tok-str">"{esc(item.role)}"</span><span className="tok-punct">,</span>
      </>,
      <>
        {'    '}<span className="tok-prop">company</span><span className="tok-punct">:</span>{' '}
        <span className="tok-str">"{esc(item.company)}"</span><span className="tok-punct">,</span>
      </>,
      <>
        {'    '}<span className="tok-prop">period</span><span className="tok-punct">:</span>{' '}
        <span className="tok-str">"{esc(item.period)}"</span><span className="tok-punct">,</span>
      </>,
      <>
        {'    '}<span className="tok-prop">note</span><span className="tok-punct">:</span>{' '}
        <span className="tok-str">"{esc(item.description)}"</span>
      </>,
      <>
        {'  '}<span className="tok-punct">{'}'}</span>
        {i < items.length - 1 ? <span className="tok-punct">,</span> : null}
      </>
    );
  });
  lines.push(
    <>
      <span className="tok-punct">];</span>
    </>
  );
  return lines;
}

export default function Home() {
  usePageTitle(
    'Moleboheng Mahlatji',
    'Final-year BSc Computer Science & Applied Statistics student at the University of Cape Town, and Computer Science tutor.'
  );

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero" id="top">
        <div className="wrap">
          <h1 className="hero__title">
            <span className="md-mark mono" aria-hidden="true"># </span>
            Moleboheng Mahlatji
          </h1>
          <p className="hero__sub">
            Final-year BSc Computer Science &amp; Applied Statistics student at
            the University of Cape Town, and a Computer Science tutor. I write
            software that is quiet, fast, and clear.
          </p>

          <CodeBlock
            lines={profileLines}
            filename="profile.ts"
            lang="TypeScript"
            className="hero__code"
          />

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
          lines={timelineLines('experience', 'Experience', experience)}
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
          lines={timelineLines('education', 'Education', education)}
          filename="education.ts"
          lang="TypeScript"
        />
      </Section>

      {/* ============ PROJECTS ============ */}
      <Section
        id="projects"
        title="Things I've shipped."
        intro="A selection of projects — each one running live where it can. All of them taught me something."
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
                <span>git clone github.com/mmahlatji</span>
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
                  <a href="mailto:molebohengmahlatji@gmail.com" className="terminal__mail">
                    molebohengmahlatji@gmail.com
                  </a>
                </span>
                <span className="caret" aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
