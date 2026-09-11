import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'mira-coach',
    title: 'Mira Coach',
    summary: 'An AI-powered resume builder and career coach.',
    description:
      'A monorepo app pairing a FastAPI + SQLModel backend with an Expo React Native frontend, featuring deterministic ATS scoring, job-description keyword matching, and AI rewrite suggestions without hallucination.',
    githubRepo: { name: 'mira-coach', owner: 'arnav-kumar-26' },
    tags: ['FastAPI', 'Expo', 'React Native', 'TypeScript', 'SQLModel'],
    coverImage: 'mira-coach-cover.png',
    status: 'in-progress',
  },
  {
    id: 'collar-plugin',
    title: 'Collar',
    summary: 'LLM-powered code validation VS Code plugin.',
    description:
      'A language-agnostic agent that validates code against business, architectural, and security rules in real time, utilizing a fully serverless Supabase backend with Realtime WebSockets.',
    githubRepo: { name: 'collar', owner: 'arnav-kumar-26' },
    tags: ['TypeScript', 'React', 'Supabase', 'LLMs'],
    coverImage: 'collar-cover.png',
    status: 'shipped',
  },
  {
    id: 'fleettrack',
    title: 'FleetTrack',
    summary: 'Internal fleet management application.',
    description:
      'Platform for tracking vehicles and maintenance history, built with a .NET 10 Web API backend, PostgreSQL, and an Angular frontend utilizing Tailwind CSS and Chart.js for data visualization.',
    githubRepo: { name: 'fleettrack', owner: 'arnav-kumar-26' },
    tags: ['.NET', 'Angular', 'PostgreSQL', 'Tailwind CSS'],
    coverImage: 'fleettrack-cover.png',
    status: 'shipped',
  },
];
