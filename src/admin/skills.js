import { supabase } from './client.js';
import { esc, toast, failed, field, saveOrder, move, confirmClick, splitList, slugify } from './ui.js';

let groups = [];

export async function renderSkills(panel) {
  const { data, error } = await supabase.from('skill_groups').select('*').order('sort_order');
  if (failed(error, 'تحميل المهارات')) return;
  groups = data;
  draw(panel);
}

function groupCard(group, index) {
  return `
    <form class="card form" data-id="${esc(group.id)}">
      <div class="field-pair">
        ${field('label_ar', 'اسم المجموعة (عربي)', group.label?.ar)}
        ${field('label_en', 'Group name (English)', group.label?.en, { dir: 'ltr' })}
      </div>
      ${field('items', 'المهارات', (group.items || []).join('\n'), { textarea: true, dir: 'ltr', hint: 'كل مهارة في سطر' })}
      <div class="row__actions">
        <button type="submit" class="btn btn--primary">حفظ</button>
        <button type="button" class="icon-btn" data-action="up" ${index === 0 ? 'disabled' : ''} aria-label="لفوق">↑</button>
        <button type="button" class="icon-btn" data-action="down" ${index === groups.length - 1 ? 'disabled' : ''} aria-label="لتحت">↓</button>
        <button type="button" class="btn btn--danger" data-action="delete">مسح المجموعة</button>
      </div>
    </form>`;
}

function draw(panel) {
  panel.innerHTML = `
    <div class="panel-head">
      <div><h2>المهارات</h2><p class="muted">كل مجموعة بتظهر كارت في سكشن المهارات.</p></div>
      <button type="button" class="btn btn--primary" data-action="add">مجموعة جديدة</button>
    </div>
    <div class="stack">${groups.map(groupCard).join('')}</div>`;

  panel.onclick = (event) => onAction(event, panel);
  panel.onsubmit = (event) => onSave(event, panel);
}

async function onSave(event, panel) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const label = { en: data.get('label_en').trim(), ar: data.get('label_ar').trim() };
  if (!label.en) return toast('اكتب اسم المجموعة بالإنجليزي.', true);

  const existing = groups.find((group) => group.id === form.dataset.id);
  const row = {
    id: existing.isNew ? slugify(label.en) || `group-${Date.now()}` : existing.id,
    sort_order: groups.indexOf(existing),
    label,
    items: splitList(data.get('items')),
  };
  const { error } = await supabase.from('skill_groups').upsert(row);
  if (failed(error, 'حفظ المجموعة')) return;
  toast('المجموعة اتحفظت');
  renderSkills(panel);
}

async function onAction(event, panel) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.closest('[data-id]')?.dataset.id;
  const index = groups.findIndex((group) => group.id === id);

  if (action === 'add') {
    groups.push({ id: `new-${Date.now()}`, label: { en: '', ar: '' }, items: [], isNew: true });
    draw(panel);
    panel.querySelector('form:last-of-type input')?.focus();
  } else if (action === 'up' || action === 'down') {
    if (!move(groups, index, action === 'up' ? -1 : 1)) return;
    draw(panel);
    const saved = groups.filter((group) => !group.isNew).map((group) => group.id);
    const error = await saveOrder(supabase, 'skill_groups', saved);
    if (!failed(error, 'حفظ الترتيب')) toast('الترتيب اتحفظ');
  } else if (action === 'delete') {
    if (!confirmClick(button)) return;
    if (!groups[index].isNew) {
      const { error } = await supabase.from('skill_groups').delete().eq('id', id);
      if (failed(error, 'مسح المجموعة')) return;
    }
    toast('المجموعة اتمسحت');
    renderSkills(panel);
  }
}
