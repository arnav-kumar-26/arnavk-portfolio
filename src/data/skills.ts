import type { SkillCategory } from '@/types';

export const skills: SkillCategory[] = [
  {
    category: 'AI/LLM',
    items: [
      'MCP Integration',
      'Claude API',
      'OpenAI API',
      'Multi-Provider Routing (OpenRouter/Groq)',
      'Agent Tool-Calling',
    ],
  },
  {
    category: 'Languages',
    items: ['TypeScript', 'Python', 'Java', 'C#', 'C++', 'Dart'],
  },
  {
    category: 'Frameworks',
    items: [
      'React',
      'Flutter',
      'Angular',
      'Vue.js',
      'Node.js',
      'Express',
      'Flask',
      'FastAPI',
      '.NET / ASP.NET Core',
    ],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'Oracle SQL', 'MongoDB', 'Supabase', 'EF Core', 'SQL', 'NoSQL'],
  },
  {
    category: 'Tools & Practices',
    items: [
      'Git',
      'AWS EC2',
      'WebRTC',
      'LSP',
      'REST API Design',
      'MVC Architecture',
      'OOP & Design Patterns',
      'OpenCode',
      'Claude Code',
      'Cursor',
      'VS Code Extension Development',
    ],
  },
  {
    category: 'Soft Skills',
    items: [
      'Cross-Functional Collaboration',
      'Ownership',
      'Technical Documentation',
      'Requirements Analysis & Translation',
      'Code Review',
      'Communication',
    ],
  },
];
