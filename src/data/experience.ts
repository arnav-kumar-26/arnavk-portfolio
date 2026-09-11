import type { ExperienceEntry } from '@/types';

export const experience: ExperienceEntry[] = [
  {
    id: 'fusionduo-internship-2026',
    company: 'Fusionduo Technologies',
    role: 'Software Engineer (Intern)',
    startDate: '2026-03-01',
    endDate: '2026-07-01',
    location: 'Bangalore, India',
    impactBullets: [
      'Designed and built Collar end-to-end: a language-agnostic TypeScript/React VS Code plugin using LLMs to validate code against business, architectural, and security rules in real time.',
      'Built a fully serverless backend on Supabase with Git-aware violation tracking, including commit snapshots and per-developer attribution.',
      "Architected an event-bus system to fully decouple features, authoring the platform's Software Design Document and architecture ahead of implementation.",
    ],
  },
  {
    id: 'cot-networks-internship-2025',
    company: 'COT Networks',
    role: 'Software Developer (Intern)',
    startDate: '2025-01-01',
    endDate: '2026-02-01',
    location: 'Bangalore, India',
    impactBullets: [
      'Built the main application flow for a Flutter mobile app, handling full-stack development and refactoring the codebase to improve readability by 2x.',
      'Developed a unified cab hailing application using Java and Flutter that reduced booking time by ~50%.',
      'Created a video calling application using WebRTC and EC2 that improved latency by ~60% and cut server costs by ~70%.',
    ],
  },
  {
    id: 'nous-infosystems-internship-2024',
    company: 'Nous Infosystems',
    role: 'Full-Stack Developer (Intern)',
    startDate: '2024-05-01',
    endDate: '2024-07-01',
    location: 'Bangalore, India',
    impactBullets: [
      'Developed a full-stack application using React, Flask API, and MySQL to streamline equipment assignment workflows for support engineers.',
      'Increased employee onboarding efficiency by ~40% through optimized application workflows.',
      'Created an AI chatbot utilizing Flask and the OpenAI API.',
    ],
  },
];
