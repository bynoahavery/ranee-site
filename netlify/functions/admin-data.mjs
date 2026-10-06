import { json, isAdmin } from '../lib/core.mjs';
import { buildReport } from '../lib/report.mjs';

export default async (req) => {
  if (!isAdmin(req)) return json({ error: 'Sign in to the dashboard.' }, 401);
  return json(await buildReport());
};
export const config = { path: '/api/admin/data' };
