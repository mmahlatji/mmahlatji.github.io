export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
}

export const experience: ExperienceItem[] = [
  {
    period: 'Feb 2025 — Present',
    role: 'Computer Science Tutor',
    company: 'University of Cape Town',
    description:
      'Helping students reason through computer science concepts — from fundamentals to data structures — and build confidence through practice.',
  },
  {
    period: 'Nov 2024 — Jan 2025',
    role: 'Intern Software Developer',
    company: 'Reslocate',
    description:
      'Contributed to production software during a three-month internship, learning how real teams ship, review, and maintain code.',
  },
];

export const education: ExperienceItem[] = [
  {
    period: '2024 — Present',
    role: 'BSc Computer Science & Applied Statistics',
    company: 'University of Cape Town',
    description: 'Final year — focused on systems, simulation, and data.',
  },
];

export const details = [
  { label: 'Location', value: 'Cape Town, SA' },
  { label: 'Currently', value: 'CS Tutor, UCT' },
  { label: 'Studying', value: 'CS & Applied Statistics' },
  { label: 'Previously', value: 'Intern, Reslocate' },
];

export const tools = ['Java', 'Python', 'TypeScript', 'React', 'SQL', 'Git'];
