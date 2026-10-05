import type { Project } from '../components/ProjectCard';

export const projects: Project[] = [
  {
    title: 'FLIP Water Simulation',
    description:
      'A real-time FLIP fluid simulation in Java. Hexagonal particle packing, spatial-hash neighbor lookup, and an over-relaxed pressure solver, rendered live with Swing.',
    tags: ['Java', 'Swing', 'Fluid Sim', 'Physics'],
    link: 'https://github.com/wakeupm11y/flip-water-simulator',
    demo: 'fluid',
  },
  {
    title: 'Java Ray Tracer',
    description:
      'A 2D interactive ray tracer in Java Swing. Rays are cast from a draggable light source and solved analytically against circles using the quadratic formula, with real-time shadows.',
    tags: ['Java', 'Swing', 'Ray Tracing', 'Graphics'],
    link: 'https://github.com/wakeupm11y/2D-Raytracer',
    demo: 'rays',
  },
  {
    title: 'ADMIT — Admissions Management',
    description:
      'A team capstone: a postgraduate admissions platform for UCT\'s CS honours intake. Reconciles multi-source spreadsheet imports, applies configurable rules with a live preview, and manages the applicant lifecycle — plus a local-LLM "Ask" query feature.',
    tags: ['FastAPI', 'React', 'PostgreSQL', 'Supabase'],
    demo: 'data',
  },
];
