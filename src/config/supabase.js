// Supabase project used for editable content (projects, skills, links).
// The publishable key is meant to ship in the browser: what it can do is
// decided by the row-level security policies in supabase/schema.sql, where
// anyone can read and only the admin can write. Never put a secret key here.
export const SUPABASE_URL = 'https://tebxcqhswswugfbtrxdl.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_9IUVQsqor9C1yIXz3xLkiw_4GvIQPYH';
export const IMAGE_BUCKET = 'project-images';
