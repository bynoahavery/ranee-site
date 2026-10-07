// ---------------------------------------------------------------------------
// Property content. Served ONLY to signed-in visitors via /api/content.
//
// COPY is the advertising team's text, verbatim. Edit it here.
// SECTION_HEADINGS are short design headings (not ad copy) — change freely.
// PHOTOS: order here = order on the page and in the slideshow.
//   id     -> file name in private/photos/{sm,md,full}/<id>.jpg
//   title  -> short name shown in the slideshow caption and the admin dashboard
//   alt    -> descriptive alt text
//   group  -> which section of the page the photo sits in
// ---------------------------------------------------------------------------

export const PROPERTY_NAME = 'Ranee';
export const LOCATION_LABEL = 'Bondi Beach';
// Street address, shown under the wordmark on the hero photo.
export const ADDRESS = '4 Forest Knoll Avenue, Bondi Beach';

// Agent contact, shown beside the hero wordmark. `tel` is the dialling format for the call link.
export const AGENT = {
  label: 'Contact agent',
  name: 'Nicholas Breadman',
  phone: '0407 551 446',
  tel: '+61407551446',
};

export const COPY = {
  title: "'Ranee' – 576 sqm Freestanding Character Home with Pool, Moments to Bondi Beach",
  stats: ['5 Bed', '5 Bath', '4 Car', '576 sqm'],
  intro:
    "Seamlessly blending period elegance with refined contemporary finishes, 'Ranee' is a distinguished 1920s residence offering five bedrooms, five bathrooms and a rare combination of space, privacy and lifestyle. Positioned on 576 sqm in a tranquil, tree-lined cul-de-sac, the home is within easy walking distance of Bondi Beach, boutique shops and cafés.",
  interiors:
    'The interiors showcase original character, with timber floors, soaring ceilings and stained glass windows, all bathed in natural light. At the heart of the home, the formal lounge centres on an elegant fireplace, creating a warm and inviting setting for winter gatherings. Multiple living zones, including formal dining and a separate casual family living area, give the home a natural flow for entertaining year-round.',
  outdoors:
    'Outdoors, the home becomes a private sanctuary designed for entertaining on a grand scale. Steel-framed bi-fold doors extend the living space onto a sun-drenched alfresco terrace overlooking the swimming pool. An expansive marble servery opens from the kitchen directly to the built-in BBQ and wood-fired pizza oven, creating a seamless connection between indoor and outdoor hosting. A private infrared sauna adds a touch of everyday luxury.',
  features: [
    'Period features including timber floors, high ceilings and stained glass windows',
    'Elegant fireplace creating a warm focal point for winter entertaining',
    'Formal lounge and dining complemented by a separate casual living area',
    "Gourmet island kitchen with marble benchtops, a custom-made ILVE 'Majestic' freestanding oven (a rare luxury for the home chef), two dishwashers, a wine fridge and an expansive marble servery to the alfresco area",
    'Steel-framed bi-fold doors opening to an expansive alfresco terrace with built-in BBQ, wood-fired pizza oven and outdoor fridge',
    'Heated magnesium saltwater pool and spa, allowing for year-round use',
    'Ample space to create your own wellness centre, with an existing infrared sauna and room for a home gym',
    'Established, low-maintenance gardens with a level lawn',
    'Self-contained accommodation beneath the residence with a separate entrance, perfect for older children, an au pair or international guests',
    'Double lock-up garage with storage, plus additional parking for two cars (not on title) and a garden shed',
    'Potential to add an additional storey for a master retreat or further family accommodation (STCA)',
  ],
  closing:
    "From evenings by the fire in winter to poolside BBQs in summer, 'Ranee' is a home designed for entertaining in every season. This is a true generational home, offering the rare opportunity to secure a family residence in one of the area's most peaceful and sought-after pockets, where memories will be made for decades to come.",
};

// Photo shown (greyscale, darkened) behind the Features list. Any photo id below.
export const FEATURES_BACKDROP = 'pool';

export const SECTION_HEADINGS = {
  interiors: 'Inside',
  outdoors: 'Outside',
  features: 'Features',
  more: 'Wellness, Self Contained Accommodation and Garaging',
  floorplan: 'Floor plan',
  location: 'Location',
};

// Disclaimer shown at the foot of the page. Leave empty ('') to hide it.
export const DISCLAIMER =
  "Disclaimer: All information contained herein has been gathered from sources we believe to be reliable, including the vendor. However, we cannot guarantee its accuracy, and no warranty or representation is given or implied. This material does not form part of any offer or contract. Interested persons should rely on their own enquiries and inspections, and should seek independent legal, financial and building advice before purchasing. All measurements, land areas and room dimensions are approximate. Photographs, styling and furniture are for illustrative purposes only and may not be included in the sale. Two car spaces are located in front of the existing garages and do not form part of the title. Any reference to development potential is subject to council approval (STCA).";

export const PHOTOS = [
  { id: 'facade', group: 'hero', title: 'Front garden and facade',
    alt: 'Front of the 1920s brick bungalow at dusk, with a white timber gable, lit stained-glass bay windows, sandstone stairs and a garden path between clipped hedges.' },

  { id: 'family-living', group: 'interiors', title: 'Family living',
    alt: 'Casual family living room with sage sofas on a jute rug, opening through black steel-framed bi-fold doors to the alfresco terrace, beside the kitchen and its book-lined island.' },
  { id: 'kitchen-island', group: 'interiors', title: 'Island kitchen',
    alt: 'Kitchen with a white marble-topped island whose base is open shelving filled with colour-sorted cookbooks, brass pendant lights, a black rangehood and a stainless-steel fridge.' },
  { id: 'kitchen-servery', group: 'interiors', title: 'Kitchen and servery',
    alt: 'Kitchen with marble benchtops and splashback, a black freestanding range oven, wine fridge and black dishwasher, and a wide lift-up window opening as a servery to the garden and pizza oven.' },
  { id: 'formal-lounge', group: 'interiors', title: 'Formal lounge',
    alt: 'Formal lounge with deep teal walls, a brick fireplace with dark marble surround and wood heater, stained-glass cabinets, timber floors and floor-to-ceiling white bookshelves.' },
  { id: 'formal-dining', group: 'interiors', title: 'Formal dining',
    alt: 'Formal dining room with a dark timber table for eight, teal walls, an ornate ceiling rose, white built-in shelving with a bar, and stained-glass double doors open to a sunlit verandah.' },
  { id: 'bedroom-main', group: 'interiors', title: 'Bedroom',
    alt: 'Bedroom with timber floors, white built-in wardrobes and overhead cabinetry framing the bed, and a bay window seat beneath original stained-glass windows.' },
  { id: 'bedroom-palm', group: 'interiors', title: 'Bedroom',
    alt: 'Bedroom with timber floors, palm-print feature wallpaper, a white single bed, a desk beneath a sheer-curtained window and a hanging macramé chair.' },
  { id: 'bedroom-mural', group: 'interiors', title: 'Bedroom',
    alt: 'Bedroom with timber floors, a basketball-themed mural feature wall, a white single bed, timber wall shelves and a sash window with striped curtains.' },
  { id: 'bathroom', group: 'interiors', title: 'Bathroom',
    alt: 'Bathroom with white mosaic wall tiles, a tiled-in bathtub with a chrome telephone-style mixer, chrome washstand basin, heated towel rail and a frosted sash window.' },

  { id: 'alfresco-terrace', group: 'outdoors', title: 'Alfresco terrace',
    alt: 'Alfresco terrace at dusk under an adjustable louvred roof, with an outdoor lounge, a long dining table, and bi-fold doors open to the lit family living area and kitchen.' },
  { id: 'outdoor-dining', group: 'outdoors', title: 'Outdoor dining',
    alt: 'Outdoor dining table set for dinner beside the brick wood-fired pizza oven and BBQ, with the kitchen’s marble servery window open onto the terrace.' },
  { id: 'alfresco-lounge', group: 'outdoors', title: 'Terrace and pizza oven',
    alt: 'Wide view of the louvred alfresco terrace at dusk, with curved sandstone retaining walls, lit garden beds, the dining table, wood-fired pizza oven and BBQ.' },
  { id: 'pool', group: 'outdoors', title: 'Heated pool',
    alt: 'Swimming pool at dusk with sandstone steps and coping, a daybed on a raised ledge, a lit garden tree, and the open rear of the home glowing beyond.' },
  { id: 'lawn', group: 'outdoors', title: 'Level lawn',
    alt: 'Level lawn bordered by ivy-covered fences and tall palms, with a cushioned daybed on a sandstone platform and a hanging rattan egg chair.' },

  { id: 'gym', group: 'more', title: 'Home gym',
    alt: 'Home gym with rubber floor tiles, a treadmill, exercise bike and weights bench, white storage cupboards and a desk nook with an aquarium.' },
  { id: 'guest-living', group: 'more', title: 'Self Contained Accommodation',
    alt: 'Living room of the self-contained accommodation, with a grey sofa on a jute rug, low white bookshelves, a wall-mounted TV and steps up to a bedroom alcove.' },
  { id: 'guest-kitchenette', group: 'more', title: 'Self Contained Accommodation',
    alt: 'Kitchenette in the self-contained accommodation with black-and-white chequerboard floor tiles, white cabinetry, a stainless benchtop, a small round dining table and a garden-view window.' },
  { id: 'garage', group: 'more', title: 'Double Garaging',
    alt: 'Lock-up garage with a parked convertible, a timber workbench and pegboard tool wall, overhead storage racks and paint shelving.' },

  { id: 'floor-plan', group: 'floorplan', title: 'Floor plan',
    alt: 'Floor plan showing the ground floor with four bedrooms, kitchen, formal and informal living and dining; attic storage; the lower ground floor with bedroom 5, self-contained accommodation, sauna and storage; and a site plan with lawn, pool, spa and lock-up garage.' },

  { id: 'aerial', group: 'location', title: 'Short Stroll to Bondi Beach',
    alt: 'Aerial photo looking towards Bondi Beach and the ocean, with an arrow marking the home’s terracotta roof in a leafy street a short walk from the beach.' },
];

export const PHOTO_IDS = new Set(PHOTOS.map((p) => p.id));
export const PHOTO_SIZES = new Set(['sm', 'md', 'full']);
export const photoTitle = (id) => PHOTOS.find((p) => p.id === id)?.title ?? id;
