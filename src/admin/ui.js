// Small rendering helpers shared by every dashboard tab.

export function esc(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer;
export function toast(message, isError = false) {
  const node = document.getElementById('toast');
  node.textContent = message;
  node.classList.toggle('toast--error', isError);
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (node.hidden = true), isError ? 6000 : 2500);
}

// Supabase returns { error } instead of throwing; this turns a failed call into
// a visible message and tells the caller whether to carry on.
export function failed(error, what) {
  if (!error) return false;
  console.error(what, error);
  toast(`${what}: ${error.message}`, true);
  return true;
}

export function field(name, label, value = '', { textarea = false, dir = '', hint = '', type = 'text' } = {}) {
  const control = textarea
    ? `<textarea name="${name}" rows="3" ${dir && `dir="${dir}"`}>${esc(value)}</textarea>`
    : `<input type="${type}" name="${name}" value="${esc(value)}" ${dir && `dir="${dir}"`} />`;
  return `<label class="field"><span>${label}</span>${control}${hint ? `<small>${hint}</small>` : ''}</label>`;
}

// A pair of inputs for one piece of copy in both languages.
export function bilingual(name, label, value, options = {}) {
  return `<div class="field-pair">
    ${field(`${name}_ar`, `${label} (عربي)`, value?.ar, { ...options, dir: 'rtl' })}
    ${field(`${name}_en`, `${label} (English)`, value?.en, { ...options, dir: 'ltr' })}
  </div>`;
}

export const readPair = (data, name) => ({
  en: (data.get(`${name}_en`) || '').trim(),
  ar: (data.get(`${name}_ar`) || '').trim(),
});

export const hasText = (pair) => Boolean(pair.en || pair.ar);

export const splitList = (value = '') =>
  value
    .split(/[\n,،]/)
    .map((item) => item.trim())
    .filter(Boolean);

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Rewrites sort_order to match the order of ids on screen.
export async function saveOrder(supabase, table, ids) {
  const results = await Promise.all(
    ids.map((id, index) => supabase.from(table).update({ sort_order: index }).eq('id', id))
  );
  return results.find((result) => result.error)?.error || null;
}

export function move(list, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= list.length) return false;
  [list[index], list[target]] = [list[target], list[index]];
  return true;
}

// Delete buttons ask for a second click instead of opening a browser dialog.
export function confirmClick(button) {
  if (button.dataset.armed) return true;
  button.dataset.armed = '1';
  button.dataset.label = button.textContent;
  button.textContent = 'متأكد؟ اضغط تاني';
  setTimeout(() => {
    delete button.dataset.armed;
    button.textContent = button.dataset.label;
  }, 3000);
  return false;
}
