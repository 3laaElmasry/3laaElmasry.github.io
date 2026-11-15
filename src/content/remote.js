import { SUPABASE_URL, SUPABASE_KEY } from '../config/supabase.js';

async function fetchTable(query) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: { apikey: SUPABASE_KEY },
  });
  if (!response.ok) throw new Error(`Supabase ${response.status} on ${query}`);
  return response.json();
}

// Database rows use snake_case; the components expect the same shape as src/data/*.js.
export function rowToProject(row) {
  return {
    id: row.id,
    featured: row.featured,
    url: row.url,
    domain: row.domain,
    name: row.name,
    screenshots: row.screenshots || {},
    category: row.category,
    metric: row.metric,
    highlight: row.highlight,
    tags: row.tags,
    oneLiner: row.one_liner,
    challenge: row.challenge,
    whatIBuilt: row.what_i_built,
    result: row.result,
  };
}

export async function fetchRemoteContent() {
  const [projects, skillGroups, socials, settings] = await Promise.all([
    fetchTable('projects?select=*&published=eq.true&order=sort_order'),
    fetchTable('skill_groups?select=*&order=sort_order'),
    fetchTable('socials?select=*&visible=eq.true&order=sort_order'),
    fetchTable('site_settings?select=*&key=eq.contact'),
  ]);

  // An empty table means the database has not been set up yet, not that the
  // owner deleted everything, so the bundled content stays in place.
  if (!projects.length || !settings.length) return null;

  return {
    projects: projects.map(rowToProject),
    skillGroups,
    socials,
    contact: settings[0].value,
  };
}
