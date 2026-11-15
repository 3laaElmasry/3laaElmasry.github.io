import { supabase } from './client.js';
import { esc, toast, failed, saveOrder, move, confirmClick } from './ui.js';
import { openProjectForm } from './projectForm.js';
import { getProjectImage } from '../utils/images.js';

let rows = [];

export async function renderProjects(panel) {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');
  if (failed(error, 'تحميل المشاريع')) return;
  rows = data;
  draw(panel);
}

function draw(panel) {
  panel.innerHTML = `
    <div class="panel-head">
      <div>
        <h2>المشاريع</h2>
        <p class="muted">الترتيب هنا هو ترتيبها في الموقع. المشروع الرئيسي بياخد الكارت الكبير.</p>
      </div>
      <button type="button" class="btn btn--primary" data-action="add">مشروع جديد</button>
    </div>
    <ul class="rows">
      ${rows
        .map(
          (row, index) => `
        <li class="row" data-id="${esc(row.id)}">
          <img class="row__thumb" src="${esc(getProjectImage(row.screenshots?.desktop))}" alt="" />
          <div class="row__main">
            <strong dir="ltr">${esc(row.name)}</strong>
            <span class="muted" dir="ltr">${esc(row.domain)}</span>
          </div>
          <div class="row__badges">
            ${row.featured ? '<span class="badge badge--accent">رئيسي</span>' : ''}
            ${row.published ? '' : '<span class="badge">مخفي</span>'}
          </div>
          <div class="row__actions">
            <button type="button" class="icon-btn" data-action="up" ${index === 0 ? 'disabled' : ''} aria-label="لفوق">↑</button>
            <button type="button" class="icon-btn" data-action="down" ${index === rows.length - 1 ? 'disabled' : ''} aria-label="لتحت">↓</button>
            <button type="button" class="btn btn--ghost" data-action="edit">تعديل</button>
            <button type="button" class="btn btn--danger" data-action="delete">مسح</button>
          </div>
        </li>`
        )
        .join('')}
    </ul>
    ${rows.length ? '' : '<p class="muted">مفيش مشاريع لسه. ضيف أول مشروع.</p>'}`;

  panel.onclick = (event) => onAction(event, panel);
}

async function onAction(event, panel) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.closest('[data-id]')?.dataset.id;
  const index = rows.findIndex((row) => row.id === id);
  const reload = () => renderProjects(panel);

  if (action === 'add') {
    openProjectForm(panel, null, rows.length, reload);
  } else if (action === 'edit') {
    openProjectForm(panel, rows[index], rows[index].sort_order, reload);
  } else if (action === 'up' || action === 'down') {
    if (!move(rows, index, action === 'up' ? -1 : 1)) return;
    draw(panel);
    const error = await saveOrder(supabase, 'projects', rows.map((row) => row.id));
    if (!failed(error, 'حفظ الترتيب')) toast('الترتيب اتحفظ');
  } else if (action === 'delete') {
    if (!confirmClick(button)) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (failed(error, 'مسح المشروع')) return;
    toast('المشروع اتمسح');
    reload();
  }
}
