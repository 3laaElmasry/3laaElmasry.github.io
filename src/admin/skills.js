import { supabase } from './client.js';
import { esc, toast, failed, field, saveOrder, move, confirmClick, splitList, slugify } from './ui.js';

let groups = [];

export async function renderSkills(panel) {
  const { data, error } = await supabase.from('skill_groups').select('*').order('sort_order');
  if (failed(error, 'Loading skills')) return;
  groups = data;
  draw(panel);
}

function groupCard(group, index) {
  return `
    <form class="card form" data-id="${esc(group.id)}">
      <div class="field-pair">
        ${field('label_en', 'Group name (English)', group.label?.en)}
        ${field('label_ar', 'Group name (Arabic)', group.label?.ar, { dir: 'rtl' })}
      </div>
      ${field('items', 'Skills', (group.items || []).join('\n'), { textarea: true, dir: 'ltr', hint: 'One skill per line' })}
      <div class="row__actions">
        <button type="submit" class="btn btn--primary">Save</button>
        <button type="button" class="icon-btn" data-action="up" ${index === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
        <button type="button" class="icon-btn" data-action="down" ${index === groups.length - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>
        <button type="button" class="btn btn--danger" data-action="delete">Delete group</button>
      </div>
    </form>`;
}

function draw(panel) {
  panel.innerHTML = `
    <div class="panel-head">
      <div><h2>Skills</h2><p class="muted">Each group is one card in the skills section.</p></div>
      <button type="button" class="btn btn--primary" data-action="add">New group</button>
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
  if (!label.en) return toast('Enter the group name in English.', true);

  const existing = groups.find((group) => group.id === form.dataset.id);
  const row = {
    id: existing.isNew ? slugify(label.en) || `group-${Date.now()}` : existing.id,
    sort_order: groups.indexOf(existing),
    label,
    items: splitList(data.get('items')),
  };
  const { error } = await supabase.from('skill_groups').upsert(row);
  if (failed(error, 'Saving group')) return;
  toast('Group saved');
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
    if (!failed(error, 'Saving order')) toast('Order saved');
  } else if (action === 'delete') {
    if (!confirmClick(button)) return;
    if (!groups[index].isNew) {
      const { error } = await supabase.from('skill_groups').delete().eq('id', id);
      if (failed(error, 'Delete group')) return;
    }
    toast('Group deleted');
    renderSkills(panel);
  }
}
