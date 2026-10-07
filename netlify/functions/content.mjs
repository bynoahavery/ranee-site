import { json, getViewer } from '../lib/core.mjs';
import { COPY, PHOTOS, SECTION_HEADINGS, PROPERTY_NAME, LOCATION_LABEL, ADDRESS, FEATURES_BACKDROP, AGENT, DISCLAIMER } from '../lib/content.mjs';

// Returns the property content to signed-in visitors only.
export default async (req) => {
  const viewer = getViewer(req);
  if (!viewer) return json({ error: 'Sign in to view this property.' }, 401);


  return json({
    viewer: { name: viewer.name },
    property: { name: PROPERTY_NAME, location: LOCATION_LABEL, address: ADDRESS },
    agent: AGENT,
    disclaimer: DISCLAIMER,
    floorplanPdf: '/api/floorplan.pdf',
    copy: COPY,
    headings: SECTION_HEADINGS,
    photos: PHOTOS,
    featuresBackdrop: FEATURES_BACKDROP,
  });
};

export const config = { path: '/api/content' };
