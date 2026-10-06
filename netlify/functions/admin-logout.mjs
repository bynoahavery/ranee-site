import { json, clearCookie, ADMIN_COOKIE } from '../lib/core.mjs';
export default async (req) => json({ ok: true }, 200, { 'Set-Cookie': clearCookie(req, ADMIN_COOKIE) });
export const config = { path: '/api/admin/logout' };
