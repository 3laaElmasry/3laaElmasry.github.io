import { supabase } from './client.js';
import { esc, toast, failed, field, bilingual, readPair, confirmClick, slugify } from './ui.js';
import { SOCIAL_ICONS } from '../utils/icons.js';

let socials = [];

export async function renderLinks(panel) {
  const [contact, list] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'contact').maybeSingle(),
    supabase.from('socials').select('*').order('sort_order'),
  ]);
  if (failed(contact.error || list.error, 'تحميل الروابط')) return;
  socials = list.data;
  draw(panel, contact.data?.value || {});
}

function socialRow(social) {
  return `
    <form class="card form social" data-id="${esc(social.id)}" data-kind="social">
      <div class="field-pair field-pair--3">
        ${field('label', 'الاسم', social.label, { dir: 'ltr' })}
        ${field('url', 'اللينك', social.url, { dir: 'ltr', type: 'url' })}
        <label class="field"><span>الأيقونة</span>
          <select name="icon" dir="ltr">
            ${SOCIAL_ICONS.map((name) => `<option ${name === social.icon ? 'selected' : ''}>${name}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="row__actions">
        <label class="check"><input type="checkbox" name="visible" ${social.visible === false ? '' : 'checked'} /> ظاهر في الموقع</label>
        <button type="submit" class="btn btn--primary">حفظ</button>
        <button type="button" class="btn btn--danger" data-action="delete">مسح</button>
      </div>
    </form>`;
}

function draw(panel, contact) {
  panel.innerHTML = `
    <div class="panel-head"><div><h2>التواصل</h2><p class="muted">الواتساب والإيميل والتليفون اللي بيظهروا في كل الزراير.</p></div></div>
    <form class="card form" data-kind="contact">
      <div class="field-pair field-pair--3">
        ${field('whatsappNumber', 'رقم الواتساب', contact.whatsappNumber, { dir: 'ltr', hint: 'بكود الدولة ومن غير + أو مسافات. مثال: 201080850238' })}
        ${field('phone', 'التليفون زي ما يتكتب في الموقع', contact.phone, { dir: 'ltr' })}
        ${field('email', 'الإيميل', contact.email, { dir: 'ltr', type: 'email' })}
      </div>
      ${bilingual('whatsappMessage', 'الرسالة الجاهزة على واتساب', contact.whatsappMessage, { textarea: true })}
      <button type="submit" class="btn btn--primary">حفظ التواصل</button>
    </form>

    <div class="panel-head">
      <div><h2>السوشيال ميديا</h2><p class="muted">بتظهر في سكشن التواصل وفي الفوتر.</p></div>
      <button type="button" class="btn btn--primary" data-action="add">لينك جديد</button>
    </div>
    <div class="stack">${socials.map(socialRow).join('')}</div>`;

  panel.onsubmit = (event) => onSave(event, panel);
  panel.onclick = (event) => onAction(event, panel, contact);
}

async function onSave(event, panel) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  if (form.dataset.kind === 'contact') {
    const value = {
      whatsappNumber: data.get('whatsappNumber').replace(/\D/g, ''),
      phone: data.get('phone').trim(),
      email: data.get('email').trim(),
      whatsappMessage: readPair(data, 'whatsappMessage'),
    };
    if (!value.whatsappNumber) return toast('اكتب رقم الواتساب.', true);
    const { error } = await supabase.from('site_settings').upsert({ key: 'contact', value });
    if (!failed(error, 'حفظ التواصل')) toast('بيانات التواصل اتحفظت');
    return;
  }

  const existing = socials.find((social) => social.id === form.dataset.id);
  const label = data.get('label').trim();
  const url = data.get('url').trim();
  if (!label || !url) return toast('اكتب الاسم واللينك.', true);
  const row = {
    id: existing.isNew ? `${slugify(label) || 'link'}-${Date.now().toString(36)}` : existing.id,
    sort_order: socials.indexOf(existing),
    label,
    url,
    icon: data.get('icon'),
    visible: data.get('visible') === 'on',
  };
  const { error } = await supabase.from('socials').upsert(row);
  if (failed(error, 'حفظ اللينك')) return;
  toast('اللينك اتحفظ');
  renderLinks(panel);
}

async function onAction(event, panel, contact) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  if (button.dataset.action === 'add') {
    socials.push({ id: `new-${Date.now()}`, label: '', url: '', icon: 'link', visible: true, isNew: true });
    draw(panel, contact);
    panel.querySelector('.social:last-of-type input')?.focus();
    return;
  }
  if (!confirmClick(button)) return;
  const id = button.closest('[data-id]').dataset.id;
  const social = socials.find((item) => item.id === id);
  if (!social.isNew) {
    const { error } = await supabase.from('socials').delete().eq('id', id);
    if (failed(error, 'مسح اللينك')) return;
  }
  toast('اللينك اتمسح');
  renderLinks(panel);
}
