import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getViewer } from '../lib/core.mjs';

// Serves the floor plan PDF to signed-in visitors only.
let file;
function findFile() {
  if (file) return file;
  const here = (() => { try { return path.dirname(fileURLToPath(import.meta.url)); } catch { return ''; } })();
  const roots = [process.env.LAMBDA_TASK_ROOT, process.cwd(), here,
    here && path.resolve(here, '..'), here && path.resolve(here, '../..'), here && path.resolve(here, '../../..')].filter(Boolean);
  for (const r of roots) {
    const p = path.join(r, 'private', 'floorplan', 'ranee-floor-plan.pdf');
    if (existsSync(p)) return (file = p);
  }
  throw new Error('Floor plan PDF not found');
}

export default async (req) => {
  if (!getViewer(req)) return new Response('Sign in to download the floor plan.', { status: 401 });
  try {
    const data = await readFile(findFile());
    return new Response(data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Ranee-Bondi-Beach-floor-plan.pdf"',
        'Cache-Control': 'private, max-age=3600',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    console.error('[ranee] floor plan read failed', err);
    return new Response('Floor plan unavailable', { status: 500 });
  }
};

export const config = { path: '/api/floorplan.pdf' };
