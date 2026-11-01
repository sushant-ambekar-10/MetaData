import { getGithubData } from '../services/github.js';

export async function github(_req, res) {
  const data = await getGithubData();
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
  res.json({ success: true, data });
}