import { json, getViewer } from '../lib/core.mjs';
import { COPY, PHOTOS, SECTION_HEADINGS, PROPERTY_NAME, LOCATION_LABEL, FEATURES_BACKDROP, AGENT } from '../lib/content.mjs';

// Returns the property content to signed-in visitors only.
export default async (req) => {
  const viewer = getViewer(req);
  if (!viewer) return json({ error: 'Sign in to view this property.' }, 401);


  return json({
    viewer: { name: viewer.name },
    property: { name: PROPERTY_NAME, location: LOCATION_LABEL },
    agent: AGENT,
    copy: COPY,
    headings: SECTION_HEADINGS,
    photos: PHOTOS,
    featuresBackdrop: FEATURES_BACKDROP,
  });
};

export const config = { path: '/api/content' };
