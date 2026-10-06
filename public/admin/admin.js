(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const TZ = 'Australia/Sydney';

  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid instanceof Node ? kid : String(kid));
    }
    return el;
  };
  const fmtDate = (iso) => iso
    ? new Date(iso).toLocaleString('en-AU', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '—';
  const emptyRow = (cols, text) => h('tr', { class: 'empty' }, h('td', { colspan: cols }, text));

  let refreshTimer = null;

  function render(d) {
    $('#updated').textContent = `Updated ${fmtDate(d.generatedAt)} (Sydney time). Refreshes every minute.`;

    $('#summary').replaceChildren(
      h('div', {}, h('dt', {}, 'People'), h('dd', {}, d.totals.people)),
      h('div', {}, h('dt', {}, 'Visits'), h('dd', {}, d.totals.visits)),
    );

    $('#people').replaceChildren(
      h('thead', {}, h('tr', {},
        h('th', {}, 'Name'), h('th', { class: 'num' }, 'Visits'), h('th', {}, 'First sign-in'), h('th', {}, 'Latest sign-in'))),
      h('tbody', {}, d.people.length
        ? d.people.map((p) => h('tr', {},
            h('td', { class: 'name' }, p.name), h('td', { class: 'num' }, p.visits),
            h('td', {}, fmtDate(p.firstSignIn)), h('td', {}, fmtDate(p.lastSignIn))))
        : emptyRow(4, 'No one has signed in yet. Share the site link and passcode to start recording visits.'))
    );

    $('#signins').replaceChildren(
      h('thead', {}, h('tr', {}, h('th', {}, 'Signed in'), h('th', {}, 'Name'))),
      h('tbody', {}, d.signIns.length
        ? d.signIns.map((s) => h('tr', {}, h('td', {}, fmtDate(s.at)), h('td', { class: 'name' }, s.name)))
        : emptyRow(2, 'No sign-ins yet.'))
    );
  }

  async function load() {
    const res = await fetch('/api/admin/data', { credentials: 'same-origin', cache: 'no-store' });
    if (res.status === 401) return showLogin();
    if (!res.ok) { $('#updated').textContent = `Could not load sign-ins (error ${res.status}). Refresh to try again.`; return; }
    render(await res.json());
    showDash();
  }

  function showLogin(msg = '') {
    clearInterval(refreshTimer);
    $('#dash').hidden = true;
    $('#login').hidden = false;
    $('#login-error').textContent = msg;
    document.body.classList.remove('is-booting');
    $('#passcode').focus();
  }
  function showDash() {
    $('#login').hidden = true;
    $('#dash').hidden = false;
    document.body.classList.remove('is-booting');
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => { if (document.visibilityState === 'visible') load(); }, 60000);
  }

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#login-submit');
    btn.disabled = true;
    $('#login-error').textContent = '';
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
        body: JSON.stringify({ passcode: $('#passcode').value }),
      });
      const r = await res.json().catch(() => ({}));
      if (!res.ok) { $('#login-error').textContent = r.error || 'Sign-in failed.'; $('#passcode').select(); return; }
      $('#passcode').value = '';
      await load();
    } catch {
      $('#login-error').textContent = 'Could not reach the server. Check your connection and try again.';
    } finally {
      btn.disabled = false;
    }
  });

  $('#refresh').addEventListener('click', load);
  $('#signout').addEventListener('click', async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
    showLogin();
  });

  load().catch(() => showLogin('Could not reach the server.'));
})();
