import { supabase } from './client.js';
import { IMAGE_BUCKET } from '../config/supabase.js';
import { esc, toast, failed, field, bilingual, readPair, hasText, splitList, slugify } from './ui.js';
import { getProjectImage } from '../utils/images.js';

const SHOTS = [
  { key: 'desktop', label: 'صورة الديسكتوب', hint: 'سكرين شوت طويل للصفحة كلها، عرض 1440 تقريبًا. هو اللي بيتحرك لما الماوس ييجي على الكارت.' },
  { key: 'mobile', label: 'صورة الموبايل', hint: 'سكرين شوت من الموبايل، عرض 390 تقريبًا.' },
];

function shotField(shot, screenshots) {
  const current = getProjectImage(screenshots?.[shot.key]);
  return `<div class="field shot">
    <span>${shot.label}</span>
    ${current ? `<img class="shot__preview" src="${esc(current)}" alt="" />` : '<p class="muted">مفيش صورة لسه.</p>'}
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
        <h2>${project ? `تعديل: ${esc(p.name)}` : 'مشروع جديد'}</h2>
        <button type="button" class="btn btn--ghost" id="cancel">رجوع</button>
      </div>

      <div class="field-pair">
        ${field('name', 'اسم البراند', p.name, { dir: 'ltr' })}
        ${field('url', 'لينك المتجر', p.url, { dir: 'ltr', type: 'url' })}
      </div>
      <div class="checks">
        <label><input type="checkbox" name="featured" ${p.featured ? 'checked' : ''} /> المشروع الرئيسي (الكارت الكبير)</label>
        <label><input type="checkbox" name="published" ${p.published === false ? '' : 'checked'} /> ظاهر في الموقع</label>
      </div>

      ${bilingual('category', 'التصنيف', p.category)}

      <fieldset>
        <legend>الرقم أو الهايلايت</legend>
        <p class="muted">لو عندك رقم حقيقي اكتبه. لو مفيش، سيب الرقم فاضي واكتب هايلايت.</p>
        ${field('metric_value', 'الرقم', p.metric?.value, { dir: 'ltr', hint: 'مثال: ×5 أو 1000+' })}
        ${bilingual('metric_label', 'وصف الرقم', p.metric?.label)}
        ${bilingual('highlight', 'الهايلايت', p.highlight)}
      </fieldset>

      ${bilingual('one_liner', 'سطر مختصر', p.one_liner, { textarea: true })}
      ${bilingual('challenge', 'التحدي (اختياري)', p.challenge, { textarea: true })}
      ${bilingual('what_i_built', 'اللي بنيته', p.what_i_built, { textarea: true })}
      ${bilingual('result', 'النتيجة (اختياري)', p.result, { textarea: true })}
      <div class="field-pair">
        ${field('tags_ar', 'التاجز (عربي)', (p.tags?.ar || []).join('، '), { hint: 'افصل بينهم بفاصلة' })}
        ${field('tags_en', 'Tags (English)', (p.tags?.en || []).join(', '), { dir: 'ltr' })}
      </div>

      <div class="field-pair">${SHOTS.map((shot) => shotField(shot, p.screenshots)).join('')}</div>

      <p class="form-error" id="form-error"></p>
      <button type="submit" class="btn btn--primary">حفظ</button>
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
  if (!name || !url) return showError('اكتب اسم البراند ولينك المتجر.');
  if (!id) return showError('اسم البراند لازم يكون فيه حروف إنجليزي أو أرقام علشان يتعمله ID.');

  let domain;
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return showError('لينك المتجر مش صحيح. لازم يبدأ بـ https://');
  }

  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  button.textContent = 'بيحفظ…';

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
      if (clash) throw new Error('فيه مشروع بنفس الاسم ده بالفعل.');
    }
    // only one project can hold the wide featured slot
    if (row.featured) {
      const { error } = await supabase.from('projects').update({ featured: false }).neq('id', id);
      if (error) throw error;
    }
    const { error } = await supabase.from('projects').upsert(row);
    if (error) throw error;

    toast('المشروع اتحفظ');
    done();
  } catch (error) {
    failed(error, 'حفظ المشروع');
    showError(error.message);
    button.disabled = false;
    button.textContent = 'حفظ';
  }
}
