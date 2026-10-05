import SimField from './SimField';
import RayDemo from './RayDemo';
import DataDemo from './DataDemo';
import './ProjectCard.css';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  demo?: 'fluid' | 'rays' | 'data';
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { title, description, tags, link, demo } = project;

  const demoEl = demo ? (
    <div className="card__demo" aria-hidden="true">
      {demo === 'fluid' && <SimField mode="fluid" density={18} background="#f2f1eb" className="card__canvas" />}
      {demo === 'rays' && <RayDemo className="card__canvas" />}
      {demo === 'data' && <DataDemo className="card__canvas" />}
      {demo === 'rays' && (
        <span className="card__demo-label mono">drag the light</span>
      )}
    </div>
  ) : null;

  const inner = (
    <>
      {demoEl}
      <div className="card__body">
        <div className="card__head">
          <span className="card__index mono">{(index + 1).toString().padStart(2, '0')}</span>
          {link ? (
            <span className="card__status mono">
              <span className="card__status-dot" aria-hidden="true" />
              live
            </span>
          ) : (
            <span className="card__status card__status--private mono">private</span>
          )}
        </div>
        <h3 className="card__title">{title}</h3>
        <p className="card__desc">{description}</p>
        <ul className="card__tags">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </>
  );

  if (link) {
    return (
      <a href={link} className="card" target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <div className="card">{inner}</div>;
}
