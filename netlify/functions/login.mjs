import {
  json, passcodeMatches, configProblem, cleanName, hasLetter, clientIp, newId, createViewerCookie,
  saveSignIn, isRateLimited, recordFailure, clearFailures, readJsonBody,
} from '../lib/core.mjs';

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const problem = configProblem();
  if (problem) {
    console.error(`[ranee] ${problem}`);
    return json({ error: 'The site is not configured yet. Contact the agent.' }, 503);
  }

  let body;
  try { body = await readJsonBody(req); } catch { return json({ error: 'Invalid request.' }, 400); }

  const firstName = cleanName(body.firstName, 40);
  const lastName = cleanName(body.lastName, 40);
  if (!hasLetter(firstName)) return json({ error: 'Enter your first name.', field: 'firstName' }, 400);
  if (!hasLetter(lastName)) return json({ error: 'Enter your last name.', field: 'lastName' }, 400);
  const name = `${firstName} ${lastName}`;

  // Brute-force protection only: a short-lived, hashed per-connection counter.
  // Failed attempts are not recorded anywhere else.
  const ip = clientIp(req, context);
  if (await isRateLimited(ip)) {
    return json({ error: 'Too many incorrect attempts. Wait 15 minutes, then try again.' }, 429);
  }
  if (!passcodeMatches(body.passcode, 'SITE_PASSCODE')) {
    await recordFailure(ip);
    return json({ error: 'That passcode is incorrect.', field: 'passcode' }, 401);
  }
  await clearFailures(ip);

  // The only thing tracked: who signed in, and when.
  const sid = newId();
  await saveSignIn({ sid, name, firstName, lastName, nameKey: name.toLowerCase(), at: new Date().toISOString() });

  return json({ ok: true, name }, 200, { 'Set-Cookie': createViewerCookie(req, { sid, name }) });
};

export const config = { path: '/api/login' };
