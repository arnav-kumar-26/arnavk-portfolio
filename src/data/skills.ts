import type { SkillCategory } from '@/types';

export const skills: SkillCategory[] = [
  {
    category: 'AI/LLM',
    items: ['Anthropic Claude API', 'Prompt Engineering', 'AI Agent Design', 'OpenCode', 'Cursor', 'Claude Code'],
  },
  {
    category: 'Languages',
    items: ['TypeScript', 'Python', 'Java', 'C++', 'C#', 'Dart'],
  },
  {
    category: 'Frameworks',
    items: ['React', 'React Native', 'Expo', 'Angular', 'Flutter', '.NET / ASP.NET Core', 'FastAPI', 'Node.js', 'Express', 'Flask'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'Oracle SQL', 'MongoDB', 'Supabase', 'SQLite', 'SQL', 'NoSQL'],
  },
  {
    category: 'Infrastructure & Tools',
    items: ['Git', 'AWS EC2', 'WebRTC', 'Linux', 'TCP/IP Networking (CCNA)', 'REST APIs', 'VS Code Extension API', 'Tailwind CSS', 'Software Systems Design'],
  },
  {
    category: 'Soft Skills',
    items: [
      'Analytical & Problem-Solving',
      'Cross-Functional & Cross-Team Collaboration',
      'Adaptability Across Platforms',
      'Independent Judgment & Autonomy',
      'Attention to Detail',
    ],
  },
];
