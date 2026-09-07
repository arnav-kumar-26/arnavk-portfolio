import type { ExperienceEntry } from '@/types';

export const experience: ExperienceEntry[] = [
  {
    id: 'acme-internship-2025',
    company: 'Acme Labs',
    role: 'Software Engineering Intern',
    startDate: '2025-06-01',
    endDate: 'present',
    location: 'Bengaluru, India',
    impactBullets: [
      'Shipped internal tooling used by 40+ engineers, cutting deploy verification time by 30%.',
      'Built FastAPI service for model inference with typed contracts and session-cached GitHub stats.',
      'Wrote accessible, token-driven UI primitives with zero client JS by default.',
    ],
  },
  {
    id: 'nova-internship-2024',
    company: 'Nova Systems',
    role: 'Frontend Intern',
    startDate: '2024-05-01',
    endDate: '2024-08-31',
    location: 'Remote',
    impactBullets: [
      'Implemented Astro static pages with astro:assets image pipeline and 100 Lighthouse score.',
      'Introduced hairline-grid and offset-stacking card patterns without box-shadows.',
      'Collaborated on SEO and sitemap hardening for static deploy to Cloudflare Pages.',
    ],
  },
  {
    id: 'orbit-internship-2023',
    company: 'Orbit Research',
    role: 'Engineering Intern',
    startDate: '2023-06-01',
    endDate: '2023-08-15',
    location: 'Hyderabad, India',
    impactBullets: [
      'Prototyped fleet-tracker dashboard with live map tiles and edge-cached static assets.',
      'Added sessionStorage caching for API data to respect rate limits gracefully.',
    ],
  },
];
