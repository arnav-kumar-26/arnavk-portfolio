import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'mira-coach',
    title: 'Mira Coach',
    summary: 'An AI-powered resume builder and career coach.',
    description:
      'A monorepo app pairing a FastAPI + SQLModel backend with an Expo React Native frontend — structured resume editing, PDF export, ATS scoring, job-description comparison, and an AI coaching assistant.',
    githubRepo: { name: 'mira-coach' },
    tags: ['FastAPI', 'SQLite', 'Expo', 'React Native', 'TypeScript'],
    coverImage: 'mira-coach-cover.png',
    status: 'in-progress',
  },
  {
    id: 'fleet-tracker',
    title: 'Fleet Tracker',
    summary: 'Real-time fleet tracking dashboard with live vehicle positions.',
    description:
      'A static-first dashboard with live map integration, edge-cached tiles, and session-aware data fetching — built to stay fast on low-bandwidth connections without SSR.',
    githubRepo: { name: 'fleet-tracker' },
    tags: ['TypeScript', 'Astro', 'MapLibre', 'Cloudflare'],
    coverImage: 'fleet-tracker-cover.png',
    status: 'shipped',
  },
];
