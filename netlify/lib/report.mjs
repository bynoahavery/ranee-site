import { store } from './core.mjs';

async function loadSignIns() {
  const s = store();
  const { blobs } = await s.list({ prefix: 'signins/' });
  const keys = blobs.map((b) => b.key);
  // Keys start with the arrival time, so sorting keys gives a stable order.
  keys.sort().reverse(); // newest first
  const out = [];
  for (let i = 0; i < keys.length; i += 25) {
    const chunk = await Promise.all(keys.slice(i, i + 25).map((k) => s.get(k, { type: 'json' })));
    out.push(...chunk.filter(Boolean));
  }
  return out;
}

// People are grouped by name, ignoring capitals and extra spaces.
export async function buildReport() {
  const signIns = await loadSignIns();
  const people = new Map();
  for (const s of signIns) {
    const p = people.get(s.nameKey) || { name: s.name, visits: 0, firstSignIn: s.at, lastSignIn: s.at };
    p.visits += 1;
    if (s.at < p.firstSignIn) p.firstSignIn = s.at;
    if (s.at > p.lastSignIn) p.lastSignIn = s.at;
    people.set(s.nameKey, p);
  }
  return {
    generatedAt: new Date().toISOString(),
    totals: { people: people.size, visits: signIns.length },
    people: [...people.values()].sort((a, b) => b.lastSignIn.localeCompare(a.lastSignIn)),
    signIns: signIns.map(({ name, at }) => ({ name, at })),
  };
}

// CSV of every sign-in. Cells starting with = + - @ are prefixed with ' so
// spreadsheet apps don't run them as formulas.
export async function buildCsv() {
  const signIns = await loadSignIns();
  const cell = (v) => {
    let s = v == null ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const sydney = (iso) => new Date(iso).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', dateStyle: 'medium', timeStyle: 'short' });
  const lines = ['sign_in_time_utc,sign_in_time_sydney,name'];
  for (const s of [...signIns].reverse()) lines.push([s.at, sydney(s.at), s.name].map(cell).join(','));
  return '\ufeff' + lines.join('\r\n') + '\r\n';
}
