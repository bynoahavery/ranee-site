import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getViewer } from '../lib/core.mjs';
import { PHOTO_IDS, PHOTO_SIZES } from '../lib/content.mjs';

// Photos live in /private (never published as static files) and are bundled
// into this function via netlify.toml → [functions.photo] included_files.
let photoRoot;
function findPhotoRoot() {
  if (photoRoot) return photoRoot;
  const here = (() => { try { return path.dirname(fileURLToPath(import.meta.url)); } catch { return ''; } })();
  const candidates = [
    process.env.LAMBDA_TASK_ROOT, process.cwd(), here,
    here && path.resolve(here, '..'), here && path.resolve(here, '../..'), here && path.resolve(here, '../../..'),
  ].filter(Boolean);
  for (const c of candidates) {
    const p = path.join(c, 'private', 'photos');
    if (existsSync(p)) return (photoRoot = p);
  }
  throw new Error(`Photo folder not found. Looked in: ${candidates.join(', ')}`);
}

export default async (req, context) => {
  const { id, size } = context.params || {};
  if (!PHOTO_IDS.has(id) || !PHOTO_SIZES.has(size)) return new Response('Not found', { status: 404 });

  if (!getViewer(req)) return new Response('Sign in to view this photo.', { status: 401 });

  let data;
  try {
    data = await readFile(path.join(findPhotoRoot(), size, `${id}.jpg`));
  } catch (err) {
    console.error('[ranee] photo read failed', err);
    return new Response('Photo unavailable', { status: 500 });
  }

  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      // private: the CDN must never cache these for other visitors.
      'Cache-Control': 'private, max-age=86400',
      Vary: 'Cookie',
      'X-Robots-Tag': 'noindex',
    },
  });
};

export const config = { path: '/api/photo/:id/:size' };
