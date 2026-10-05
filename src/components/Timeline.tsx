import './Timeline.css';

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
}

interface TimelineProps {
  items: ExperienceItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li className="timeline__item" key={item.period}>
          <div className="timeline__rail">
            <span className="timeline__dot" />
          </div>
          <div className="timeline__content">
            <span className="timeline__period">{item.period}</span>
            <h3 className="timeline__role">{item.role}</h3>
            <span className="timeline__company">{item.company}</span>
            <p className="timeline__desc">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
