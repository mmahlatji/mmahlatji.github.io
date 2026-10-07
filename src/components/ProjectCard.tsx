import SimField from './SimField';
import RayDemo from './RayDemo';
import DataDemo from './DataDemo';
import SentimentDemo from './SentimentDemo';
import HttpServerDemo from './HttpServerDemo';
import BenchDemo from './BenchDemo';
import { FileIcon, ArrowUpRightIcon } from './icons';
import type { Project } from '../data/projects';
import '../styles/ProjectCard.css';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { slug, title, description, tags, link, demo, file, kind } = project;

  return (
    <article
      id={`project-${slug}`}
      className="project"
    >
      <div className="project__head">
        <span className={`project__file project__file--${kind} mono`}>
          <FileIcon />
          {file}
        </span>
      </div>

      {demo && (
        <div className="project__preview">
          {demo === 'fluid' && (
            <SimField density={18} className="project__canvas" ariaLabel={`${title} — live fluid simulation`} />
          )}
          {demo === 'rays' && <RayDemo className="project__canvas" />}
          {demo === 'data' && <DataDemo className="project__canvas" />}
          {demo === 'sentiment' && <SentimentDemo />}
          {demo === 'server' && <HttpServerDemo />}
          {demo === 'bench' && <BenchDemo />}
          {demo === 'rays' && (
            <span className="project__preview-label mono">drag the light</span>
          )}
        </div>
      )}

      <div className="project__body">
        <h3 className="project__title">
          <span className="project__title-mark mono" aria-hidden="true">
            //{' '}
          </span>
          {title}
        </h3>
        <p className="project__desc">{description}</p>
        <ul className="project__tags">
          {tags.map((t) => (
            <li key={t} className="mono">
              {t}
            </li>
          ))}
        </ul>
        {link && (
          <a className="project__link mono" href={link} target="_blank" rel="noopener noreferrer">
            view source <ArrowUpRightIcon />
          </a>
        )}
      </div>
    </article>
  );
}
