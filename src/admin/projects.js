import { supabase } from './client.js';
import { esc, toast, failed, saveOrder, move, confirmClick } from './ui.js';
import { openProjectForm } from './projectForm.js';
import { getProjectImage } from '../utils/images.js';

let rows = [];

export async function renderProjects(panel) {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');
  if (failed(error, 'Loading projects')) return;
  rows = data;
  draw(panel);
}

function draw(panel) {
  panel.innerHTML = `
    <div class="panel-head">
      <div>
        <h2>Projects</h2>
        <p class="muted">This order is the order on the site. The featured project gets the wide card.</p>
      </div>
      <button type="button" class="btn btn--primary" data-action="add">New project</button>
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
            ${row.featured ? '<span class="badge badge--accent">Featured</span>' : ''}
            ${row.published ? '' : '<span class="badge">Hidden</span>'}
          </div>
          <div class="row__actions">
            <button type="button" class="icon-btn" data-action="up" ${index === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
            <button type="button" class="icon-btn" data-action="down" ${index === rows.length - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>
            <button type="button" class="btn btn--ghost" data-action="edit">Edit</button>
            <button type="button" class="btn btn--danger" data-action="delete">Delete</button>
          </div>
        </li>`
        )
        .join('')}
    </ul>
    ${rows.length ? '' : '<p class="muted">No projects yet. Add your first one.</p>'}`;

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
    if (!failed(error, 'Saving order')) toast('Order saved');
  } else if (action === 'delete') {
    if (!confirmClick(button)) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (failed(error, 'Deleting project')) return;
    toast('Project deleted');
    reload();
  }
}
