import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const TTL = 60 * 60 * 1000; // 1 hour
let cache = null; // { data, at }
let inflight = null;

const headers = () => ({
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-server',
  ...(env.GITHUB_TOKEN && { Authorization: `Bearer ${env.GITHUB_TOKEN}` }),
});

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
  return res.json();
}

// Contribution calendar needs a token (GraphQL). Optional: returns null without one.
async function fetchContributions() {
  if (!env.GITHUB_TOKEN) return null;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{
          totalContributions weeks{ contributionDays{ date contributionCount } } } } } }`,
        variables: { login: env.GITHUB_USERNAME },
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;
    return {
      total: cal.totalContributions,
      days: cal.weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
    };
  } catch {
    return null;
  }
}

async function build() {
  const u = encodeURIComponent(env.GITHUB_USERNAME);
  const [user, repos, contributions] = await Promise.all([
    gh(`/users/${u}`),
    gh(`/users/${u}/repos?per_page=100&sort=updated&type=owner`),
    fetchContributions(),
  ]);

  const own = repos.filter((r) => !r.fork && !r.archived);

  const topRepos = [...own]
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      updatedAt: r.pushed_at,
    }));

  const counts = {};
  for (const r of own) if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(counts)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  return {
    user: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar_url,
      url: user.html_url,
      followers: user.followers,
      publicRepos: user.public_repos,
    },
    topRepos,
    languages,
    contributions,
    fetchedAt: new Date().toISOString(),
  };
}

export async function getGithubData() {
  if (cache && Date.now() - cache.at < TTL) return cache.data;
  inflight ??= build()
    .then((data) => {
      cache = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      inflight = null;
    });
  try {
    return await inflight;
  } catch (err) {
    if (cache) return cache.data; // serve stale rather than fail
    console.error(err.message);
    throw new AppError(502, 'GITHUB_UNAVAILABLE', 'GitHub data is temporarily unavailable');
  }
}