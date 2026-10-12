export type FileKind = 'md' | 'ts' | 'tsx' | 'py' | 'java';

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  demo?: 'fluid' | 'rays' | 'data' | 'bench' | 'seq2seq';
  /** display filename shown in the sidebar tree and editor chrome */
  file: string;
  /** file type for icon coloring + language label */
  kind: FileKind;
}

export const projects: Project[] = [
  {
    slug: 'flip-water',
    title: 'FLIP Water Simulation',
    description:
      'A real-time FLIP fluid simulation in Java. Hexagonal particle packing, spatial-hash neighbor lookup, and an over-relaxed pressure solver, rendered live with Swing.',
    tags: ['Java', 'Swing', 'Fluid Sim', 'Physics'],
    link: 'https://github.com/mmahlatji/flip-water-simulator',
    demo: 'fluid',
    file: 'FlipWaterSim.java',
    kind: 'java',
  },
  {
    slug: 'ray-tracer',
    title: 'Java Ray Tracer',
    description:
      'A 2D interactive ray tracer in Java Swing. Rays are cast from a draggable light source and solved analytically against circles using the quadratic formula, with real-time shadows.',
    tags: ['Java', 'Swing', 'Ray Tracing', 'Graphics'],
    link: 'https://github.com/mmahlatji/2D-Raytracer',
    demo: 'rays',
    file: 'RayTracer.java',
    kind: 'java',
  },
  {
    slug: 'admit',
    title: 'ADMIT — Admissions Management',
    description:
      'A team capstone: a postgraduate admissions platform for UCT\'s CS honours intake. Reconciles multi-source spreadsheet imports, applies configurable rules with a live preview, and manages the applicant lifecycle — plus a local-LLM "Ask" query feature.',
    tags: ['FastAPI', 'React', 'PostgreSQL', 'Supabase'],
    demo: 'data',
    file: 'admit.ts',
    kind: 'ts',
  },
  {
    slug: 'g2p-seq2seq',
    title: 'Grapheme-to-Phoneme Seq2Seq',
    description:
      'A grapheme-to-phoneme sequence-to-sequence model built from scratch in PyTorch. Implements LSTM cells, an encoder–decoder with context injection, and an attention mechanism, then compares the architectures on the CMU Pronouncing Dictionary.',
    tags: ['PyTorch', 'LSTM', 'Attention', 'Seq2Seq', 'NLP'],
    demo: 'seq2seq',
    file: 'Seq2Seq.py',
    kind: 'py',
  },
  {
    slug: 'manybench',
    title: 'ManyBench',
    description:
      'A local-first benchmarking platform that orchestrates JMH via @bench source comments. Describe what to measure, and it discovers routines, generates benchmarks, builds, and reports timings — across languages by design.',
    tags: ['Python', 'Typer', 'JMH', 'Java', 'CLI'],
    link: 'https://github.com/mmahlatji/manybench',
    demo: 'bench',
    file: 'manybench.py',
    kind: 'py',
  },
];
