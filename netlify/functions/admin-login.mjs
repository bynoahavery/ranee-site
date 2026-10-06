import {
  json, passcodeMatches, configProblem, clientIp, createAdminCookie,
  isRateLimited, recordFailure, clearFailures, readJsonBody,
} from '../lib/core.mjs';

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const problem = configProblem();
  if (problem) { console.error(`[ranee] ${problem}`); return json({ error: problem }, 503); }

  let body;
  try { body = await readJsonBody(req); } catch { return json({ error: 'Invalid request.' }, 400); }
  const ip = clientIp(req, context);

  if (await isRateLimited(ip)) return json({ error: 'Too many incorrect attempts. Wait 15 minutes, then try again.' }, 429);
  if (!passcodeMatches(body.passcode, 'ADMIN_PASSCODE')) {
    await recordFailure(ip);
    return json({ error: 'That passcode is incorrect.' }, 401);
  }
  await clearFailures(ip);
  return json({ ok: true }, 200, { 'Set-Cookie': createAdminCookie(req) });
};

export const config = { path: '/api/admin/login' };
