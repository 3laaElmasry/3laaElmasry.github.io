import { supabase } from './client.js';
import { esc } from './ui.js';

export function renderLogin(root, message = '') {
  root.innerHTML = `
    <main class="login">
      <form class="card login__card" id="login-form">
        <h1>Dashboard</h1>
        <p class="muted">Sign in to edit projects, skills and links.</p>
        <label class="field"><span>Email</span><input type="email" name="email" dir="ltr" autocomplete="username" required /></label>
        <label class="field"><span>Password</span><input type="password" name="password" dir="ltr" autocomplete="current-password" required /></label>
        <p class="form-error" id="login-error">${esc(message)}</p>
        <button class="btn btn--primary" type="submit">Sign in</button>
      </form>
    </main>`;

  root.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const button = event.target.querySelector('button');
    button.disabled = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: form.get('email').trim(),
      password: form.get('password'),
    });
    button.disabled = false;
    if (error) {
      root.querySelector('#login-error').textContent = 'Wrong email or password.';
    }
    // on success, the auth listener in main.js swaps in the dashboard
  });
}

// Being signed in is not enough: the account must be listed in public.admins.
// The database enforces this on every write; this check only decides what to show.
export async function isAdmin(userId) {
  const { data, error } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle();
  return !error && Boolean(data);
}
