import { site } from '../data/site.js';
import { defaultContent } from './defaults.js';
import { fetchRemoteContent } from './remote.js';

const CACHE_KEY = 'alaa-portfolio-content-v1';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // storage unavailable or corrupted: fall back to the bundle
  }
}

function writeCache(content) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    /* storage unavailable */
  }
}

// Start from the last version this browser saw, so a returning visitor gets
// the owner's latest edits on first paint instead of a flash of old content.
let content = readCache() || defaultContent();

export const getProjects = () => content.projects;
export const getSkillGroups = () => content.skillGroups;
export const getSocials = () => content.socials;
export const getSite = () => ({ ...site, ...content.contact });

// Pulls the live content. Resolves true when it differs from what is on screen
// (the caller re-renders), false when nothing changed or the database is down.
export async function refreshContent() {
  try {
    const remote = await fetchRemoteContent();
    if (!remote) return false;
    const changed = JSON.stringify(remote) !== JSON.stringify(content);
    content = remote;
    writeCache(remote);
    return changed;
  } catch (error) {
    console.warn('Using bundled content:', error.message);
    return false;
  }
}
