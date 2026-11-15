import { supabase } from './client.js';
import { IMAGE_BUCKET } from '../config/supabase.js';
import { esc, toast, failed, field, bilingual, readPair, hasText, splitList, slugify } from './ui.js';
import { getProjectImage } from '../utils/images.js';

const SHOTS = [
  { key: 'desktop', label: 'Desktop screenshot', hint: 'A tall full-page screenshot, about 1440px wide. This is the one that scrolls when the card is hovered.' },
  { key: 'mobile', label: 'Mobile screenshot', hint: 'A phone screenshot, about 390px wide.' },
];

function shotField(shot, screenshots) {
  const current = getProjectImage(screenshots?.[shot.key]);
  return `<div class="field shot">
    <span>${shot.label}</span>
    ${current ? `<img class="shot__preview" src="${esc(current)}" alt="" />` : '<p class="muted">No image yet.</p>'}
    <input type="file" name="shot_${shot.key}" accept="image/webp,image/png,image/jpeg" />
    <small>${shot.hint}</small>
  </div>`;
}

export function openProjectForm(panel, project, sortOrder, done) {
  const p = project || {};
  panel.onclick = null;
  panel.innerHTML = `
    <form class="card form" id="project-form">
      <div class="panel-head">
        <h2>${project ? `Edit: ${esc(p.name)}` : 'New project'}</h2>
        <button type="button" class="btn btn--ghost" id="cancel">Back</button>
      </div>

      <div class="field-pair">
        ${field('name', 'Brand name', p.name, { dir: 'ltr' })}
        ${field('url', 'Store link', p.url, { dir: 'ltr', type: 'url' })}
      </div>
      <div class="checks">
        <label><input type="checkbox" name="featured" ${p.featured ? 'checked' : ''} /> Featured project (the wide card)</label>
        <label><input type="checkbox" name="published" ${p.published === false ? '' : 'checked'} /> Visible on the site</label>
      </div>

      ${bilingual('category', 'Category', p.category)}

      <fieldset>
        <legend>Number or highlight</legend>
        <p class="muted">If you have a real number, enter it. If not, leave the number empty and write a highlight.</p>
        ${field('metric_value', 'Number', p.metric?.value, { dir: 'ltr', hint: 'Example: ×5 or 1000+' })}
        ${bilingual('metric_label', 'Number label', p.metric?.label)}
        ${bilingual('highlight', 'Highlight', p.highlight)}
      </fieldset>

      ${bilingual('one_liner', 'One-liner', p.one_liner, { textarea: true })}
      ${bilingual('challenge', 'Challenge (optional)', p.challenge, { textarea: true })}
      ${bilingual('what_i_built', 'What I built', p.what_i_built, { textarea: true })}
      ${bilingual('result', 'Result (optional)', p.result, { textarea: true })}
      <div class="field-pair">
        ${field('tags_en', 'Tags (English)', (p.tags?.en || []).join(', '), { hint: 'Separate with commas' })}
        ${field('tags_ar', 'Tags (Arabic)', (p.tags?.ar || []).join('، '), { dir: 'rtl' })}
      </div>

      <div class="field-pair">${SHOTS.map((shot) => shotField(shot, p.screenshots)).join('')}</div>

      <p class="form-error" id="form-error"></p>
      <button type="submit" class="btn btn--primary">Save</button>
    </form>`;

  panel.querySelector('#cancel').addEventListener('click', done);
  panel.querySelector('#project-form').addEventListener('submit', (event) => {
    event.preventDefault();
    save(event.target, project, sortOrder, done);
  });
}

async function upload(file, id, kind) {
  const extension = file.name.split('.').pop().toLowerCase();
  const path = `${id}/${kind}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function save(form, project, sortOrder, done) {
  const data = new FormData(form);
  const showError = (message) => (form.querySelector('#form-error').textContent = message);
  const name = data.get('name').trim();
  const url = data.get('url').trim();
  const id = project?.id || slugify(name);
  if (!name || !url) return showError('Enter the brand name and the store link.');
  if (!id) return showError('The brand name needs English letters or numbers so an ID can be made from it.');

  let domain;
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return showError('That store link is not valid. It has to start with https://');
  }

  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  button.textContent = 'Saving…';

  try {
    const screenshots = { ...(project?.screenshots || {}) };
    for (const shot of SHOTS) {
      const file = data.get(`shot_${shot.key}`);
      if (file && file.size) screenshots[shot.key] = await upload(file, id, shot.key);
    }

    const metricValue = data.get('metric_value').trim();
    const highlight = readPair(data, 'highlight');
    const challenge = readPair(data, 'challenge');
    const result = readPair(data, 'result');
    const row = {
      id,
      name,
      url,
      domain,
      sort_order: sortOrder,
      featured: data.get('featured') === 'on',
      published: data.get('published') === 'on',
      category: readPair(data, 'category'),
      metric: metricValue ? { value: metricValue, label: readPair(data, 'metric_label') } : null,
      highlight: hasText(highlight) ? highlight : null,
      tags: { en: splitList(data.get('tags_en')), ar: splitList(data.get('tags_ar')) },
      one_liner: readPair(data, 'one_liner'),
      challenge: hasText(challenge) ? challenge : null,
      what_i_built: readPair(data, 'what_i_built'),
      result: hasText(result) ? result : null,
      screenshots,
      updated_at: new Date().toISOString(),
    };

    if (!project) {
      const { data: clash } = await supabase.from('projects').select('id').eq('id', id).maybeSingle();
      if (clash) throw new Error('A project with this name already exists.');
    }
    // only one project can hold the wide featured slot
    if (row.featured) {
      const { error } = await supabase.from('projects').update({ featured: false }).neq('id', id);
      if (error) throw error;
    }
    const { error } = await supabase.from('projects').upsert(row);
    if (error) throw error;

    toast('Project saved');
    done();
  } catch (error) {
    failed(error, 'Saving project');
    showError(error.message);
    button.disabled = false;
    button.textContent = 'Save';
  }
}
