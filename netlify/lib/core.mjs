import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

// --- Configuration (set in Netlify: Site configuration → Environment variables)
//   SITE_PASSCODE   the viewing passcode visitors enter   (required)
//   ADMIN_PASSCODE  passcode for the tracking dashboard   (required)
//   SESSION_SECRET  long random string for signing cookies (required)
const env = (k) => (process.env[k] ?? '').trim();

export const VIEWER_COOKIE = 'ranee_session';
export const ADMIN_COOKIE = 'ranee_admin';
const VIEWER_TTL_S = 12 * 60 * 60; // 12 hours
const ADMIN_TTL_S = 8 * 60 * 60;

// --- Responses ---------------------------------------------------------------
export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

// --- Passcodes ---------------------------------------------------------------
// Fails closed: if the env var is missing, nothing matches.
export function passcodeMatches(input, envKey) {
  const expected = env(envKey);
  if (!expected || typeof input !== 'string') return false;
  const a = crypto.createHash('sha256').update(input.trim()).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export function configProblem() {
  const missing = ['SITE_PASSCODE', 'ADMIN_PASSCODE', 'SESSION_SECRET'].filter((k) => !env(k));
  if (missing.length) return `Missing environment variables: ${missing.join(', ')}`;
  if (env('SESSION_SECRET').length < 32) return 'SESSION_SECRET must be at least 32 characters';
  return null;
}

// --- Signed cookies ----------------------------------------------------------
const b64u = (buf) => Buffer.from(buf).toString('base64url');
const hmac = (data) => crypto.createHmac('sha256', env('SESSION_SECRET')).update(data).digest('base64url');

function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}

function verify(token) {
  if (!token || !env('SESSION_SECRET')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = hmac(body);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!p.exp || p.exp < Math.floor(Date.now() / 1000)) return null;
    return p;
  } catch {
    return null;
  }
}

function readCookie(req, name) {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function cookieString(req, name, value, maxAge) {
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function createViewerCookie(req, { sid, name }) {
  const now = Math.floor(Date.now() / 1000);
  return cookieString(req, VIEWER_COOKIE, sign({ r: 'viewer', sid, name, iat: now, exp: now + VIEWER_TTL_S }), VIEWER_TTL_S);
}
export function createAdminCookie(req) {
  const now = Math.floor(Date.now() / 1000);
  return cookieString(req, ADMIN_COOKIE, sign({ r: 'admin', iat: now, exp: now + ADMIN_TTL_S }), ADMIN_TTL_S);
}
export const clearCookie = (req, name) => cookieString(req, name, '', 0);

export function getViewer(req) {
  const p = verify(readCookie(req, VIEWER_COOKIE));
  return p && p.r === 'viewer' ? p : null;
}
export function isAdmin(req) {
  const p = verify(readCookie(req, ADMIN_COOKIE));
  return Boolean(p && p.r === 'admin');
}

// --- Visitor name ------------------------------------------------------------
export function cleanName(raw, max = 80) {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}
// A name part must contain at least one letter (any language), so "." or "-" won't pass.
export const hasLetter = (s) => /\p{L}/u.test(s);

// --- Client IP (used only for the hashed sign-in rate limit) -----------------
export function clientIp(req, context) {
  return context?.ip || req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
}

// --- Storage (Netlify Blobs) -------------------------------------------------
// Key layout:
//   signins/<time>-<id>   one record per successful sign-in: { name, nameKey, at }
//   ratelimit/<ip hash>   short-lived failed-attempt counter (no names, raw IPs or history)
export const store = () => getStore({ name: 'ranee-tracking', consistency: 'strong' });

export const newId = () => crypto.randomBytes(12).toString('base64url');
const timeKey = () => `${Date.now().toString().padStart(15, '0')}-${crypto.randomBytes(4).toString('hex')}`;

export async function saveSignIn(record) {
  await store().setJSON(`signins/${timeKey()}`, record);
}

// --- Rate limiting of failed sign-ins ----------------------------------------
const RL_MAX = 8;
const RL_WINDOW_MS = 15 * 60 * 1000;
const ipKey = (ip) => `ratelimit/${crypto.createHash('sha256').update(ip || 'unknown').digest('hex').slice(0, 32)}`;

export async function isRateLimited(ip) {
  const rec = await store().get(ipKey(ip), { type: 'json' });
  return Boolean(rec && Date.now() - rec.first < RL_WINDOW_MS && rec.count >= RL_MAX);
}
export async function recordFailure(ip) {
  const s = store();
  const rec = await s.get(ipKey(ip), { type: 'json' });
  const fresh = !rec || Date.now() - rec.first >= RL_WINDOW_MS;
  await s.setJSON(ipKey(ip), fresh ? { count: 1, first: Date.now() } : { ...rec, count: rec.count + 1 });
}
export async function clearFailures(ip) {
  await store().delete(ipKey(ip));
}

export async function readJsonBody(req, maxBytes = 16_384) {
  const text = await req.text();
  if (text.length > maxBytes) throw new Error('Body too large');
  return text ? JSON.parse(text) : {};
}
