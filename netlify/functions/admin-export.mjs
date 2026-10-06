import { isAdmin } from '../lib/core.mjs';
import { buildCsv } from '../lib/report.mjs';

export default async (req) => {
  if (!isAdmin(req)) return new Response('Sign in to the dashboard.', { status: 401 });
  const date = new Date().toISOString().slice(0, 10);
  return new Response(await buildCsv(), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ranee-sign-ins-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
};
export const config = { path: '/api/admin/export' };
