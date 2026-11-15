import '../styles/admin.css';
import { supabase } from './client.js';
import { renderLogin, isAdmin } from './auth.js';
import { renderProjects } from './projects.js';
import { renderSkills } from './skills.js';
import { renderLinks } from './links.js';

const root = document.getElementById('admin');
const TABS = [
  { id: 'projects', label: 'المشاريع', render: renderProjects },
  { id: 'skills', label: 'المهارات', render: renderSkills },
  { id: 'links', label: 'الروابط والتواصل', render: renderLinks },
];
let currentUserId = null;

function renderShell(email) {
  root.innerHTML = `
    <header class="admin-bar">
      <strong class="admin-bar__logo" dir="ltr">Elmasry.</strong>
      <nav class="tabs" role="tablist">
        ${TABS.map((tab) => `<button type="button" role="tab" class="tab" data-tab="${tab.id}">${tab.label}</button>`).join('')}
      </nav>
      <div class="admin-bar__end">
        <a class="link" href="/" target="_blank" rel="noopener">افتح الموقع</a>
        <button type="button" class="btn btn--ghost" id="sign-out" title="${email}">خروج</button>
      </div>
    </header>
    <main class="admin-main" id="panel"></main>`;

  root.querySelector('#sign-out').addEventListener('click', () => supabase.auth.signOut());
  root.querySelectorAll('[data-tab]').forEach((button) =>
    button.addEventListener('click', () => openTab(button.dataset.tab))
  );
  openTab('projects');
}

function openTab(id) {
  root.querySelectorAll('[data-tab]').forEach((button) =>
    button.setAttribute('aria-selected', String(button.dataset.tab === id))
  );
  const panel = root.querySelector('#panel');
  panel.innerHTML = '<p class="muted">بيحمّل…</p>';
  TABS.find((tab) => tab.id === id).render(panel);
}

async function showFor(session) {
  if (!session) {
    currentUserId = null;
    renderLogin(root);
    return;
  }
  if (session.user.id === currentUserId) return; // token refresh, nothing to redraw
  currentUserId = session.user.id;

  if (await isAdmin(session.user.id)) {
    renderShell(session.user.email);
  } else {
    await supabase.auth.signOut();
    renderLogin(root, 'الحساب ده مش مسموحله يعدّل. لازم يتضاف كأدمن من Supabase.');
  }
}

// Fires once on load with the stored session, then on every sign-in and sign-out.
// The callback must not await Supabase calls directly, so the work is deferred.
supabase.auth.onAuthStateChange((_event, session) => {
  setTimeout(() => showFor(session), 0);
});
