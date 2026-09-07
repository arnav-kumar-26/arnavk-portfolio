import type { GitHubRepoStats } from '@/types';

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 min — respects the 60 req/hr unauthenticated limit

export async function fetchRepoStats(
  name: string,
  owner: string = import.meta.env.PUBLIC_GITHUB_USERNAME
): Promise<GitHubRepoStats | null> {
  if (!owner) return null; // no explicit owner and no env fallback configured — render static fallback
  const cacheKey = `gh-stats:${owner}/${name}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const parsed: GitHubRepoStats = JSON.parse(cached);
    if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) return parsed;
  }

  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${name}`),
      fetch(`https://api.github.com/repos/${owner}/${name}/commits?per_page=1`),
    ]);
    if (!repoRes.ok || !commitsRes.ok) return null; // triggers static fallback, never throws to caller

    const repo = await repoRes.json();
    const commits = await commitsRes.json();

    const stats: GitHubRepoStats = {
      stars: repo.stargazers_count,
      lastCommitISO: commits[0]?.commit?.committer?.date ?? repo.pushed_at,
      fetchedAt: Date.now(),
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(stats));
    return stats;
  } catch {
    return null; // network failure — caller renders the static fallback string
  }
}
