import type { Project } from '../components/ProjectCard';

export const projects: Project[] = [
  {
    slug: 'flip-water',
    title: 'FLIP Water Simulation',
    description:
      'A real-time FLIP fluid simulation in Java. Hexagonal particle packing, spatial-hash neighbor lookup, and an over-relaxed pressure solver, rendered live with Swing.',
    tags: ['Java', 'Swing', 'Fluid Sim', 'Physics'],
    link: 'https://github.com/wakeupm11y/flip-water-simulator',
    demo: 'fluid',
  },
  {
    slug: 'ray-tracer',
    title: 'Java Ray Tracer',
    description:
      'A 2D interactive ray tracer in Java Swing. Rays are cast from a draggable light source and solved analytically against circles using the quadratic formula, with real-time shadows.',
    tags: ['Java', 'Swing', 'Ray Tracing', 'Graphics'],
    link: 'https://github.com/wakeupm11y/2D-Raytracer',
    demo: 'rays',
  },
  {
    slug: 'admit',
    title: 'ADMIT — Admissions Management',
    description:
      'A team capstone: a postgraduate admissions platform for UCT\'s CS honours intake. Reconciles multi-source spreadsheet imports, applies configurable rules with a live preview, and manages the applicant lifecycle — plus a local-LLM "Ask" query feature.',
    tags: ['FastAPI', 'React', 'PostgreSQL', 'Supabase'],
    demo: 'data',
  },
  {
    slug: 'sentiment',
    title: 'Headline Sentiment Analyzer',
    description:
      'A pipeline that scrapes market headlines from Yahoo Finance, scores them with FinBERT, and correlates the sentiment against daily open→close moves. Built with Selenium, BeautifulSoup, and Transformers.',
    tags: ['Python', 'FinBERT', 'Transformers', 'Selenium', 'pandas'],
    link: 'https://github.com/wakeupm11y/HeadlineAnalyzer',
    demo: 'sentiment',
  },
  {
    slug: 'http-server',
    title: 'Simple Java HTTP Server',
    description:
      'A minimal HTTP/1.1 server written from scratch in Java. Parses request lines, accepts connections on a ServerSocket, and responds over worker threads — built with Jackson for config and SLF4J for logging.',
    tags: ['Java', 'HTTP', 'Sockets', 'Jackson', 'SLF4J'],
    link: 'https://github.com/wakeupm11y/HTTP-Server',
    demo: 'server',
  },
  {
    slug: 'manybench',
    title: 'ManyBench',
    description:
      'A local-first benchmarking platform that orchestrates JMH via @bench source comments. Describe what to measure, and it discovers routines, generates benchmarks, builds, and reports timings — across languages by design.',
    tags: ['Python', 'Typer', 'JMH', 'Java', 'CLI'],
    link: 'https://github.com/wakeupm11y/manybench',
    demo: 'bench',
  },
];
