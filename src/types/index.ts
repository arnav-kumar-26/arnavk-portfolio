export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Email' | 'X';
  href: string;
  label: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | 'present';
  location?: string;
  impactBullets: string[];
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  demoUrl?: string;
  githubRepo?: { owner?: string; name: string };
  tags: string[];
  coverImage: string;
  status: 'shipped' | 'in-progress' | 'case-study';
}

export interface SkillCategory {
  category: 'Languages' | 'Frameworks' | 'Tools' | 'Databases' | 'Soft Skills';
  items: string[];
}

export interface GitHubRepoStats {
  stars: number;
  lastCommitISO: string;
  fetchedAt: number;
}
