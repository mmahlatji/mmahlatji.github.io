import type { ReactNode } from 'react';
import './Section.css';

interface SectionProps {
  id?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export default function Section({ id, title, intro, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="wrap">
        <h2 className="section__title">
          <span className="md-mark mono" aria-hidden="true">
            ##{' '}
          </span>
          {title}
        </h2>
        {intro && <p className="section__intro">{intro}</p>}
        <div className="section__body">{children}</div>
      </div>
    </section>
  );
}
