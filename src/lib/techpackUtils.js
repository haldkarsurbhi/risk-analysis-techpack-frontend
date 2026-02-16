/**
 * Normalizes techpack API response so the UI always receives a consistent shape.
 * Construction Intelligence Parser returns: collar, sleeve, cuff, pocket, front, back, assembly.
 * Each value is an array of { category, name, value, source, relevance }.
 */
const SECTION_KEYS = [
  'collar',
  'sleeve',
  'cuff',
  'pocket',
  'front',
  'back',
  'assembly',
];

/**
 * @param {object} raw - Raw API response (e.g. { collar: [...], front: [...], technicalTable: [...] })
 * @returns {object} Normalized { [sectionKey]: array, technicalTable?: array }
 */
export function normalizeTechpackResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ...SECTION_KEYS.reduce((acc, key) => ({ ...acc, [key]: [] }), {}), technicalTable: [] };
  }

  const normalized = {};
  for (const key of SECTION_KEYS) {
    const value = raw[key];
    if (Array.isArray(value)) {
      normalized[key] = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      normalized[key] = legacySectionToItems(value);
    } else {
      normalized[key] = [];
    }
  }
  // technicalTable: { components: [] } or legacy array
  const tt = raw.technicalTable;
  normalized.technicalTable = tt && Array.isArray(tt.components) ? tt : { components: [] };
  // baseInformation: { buyer, orderNo, styleRef, fit, season, modified }
  const bi = raw.baseInformation;
  normalized.baseInformation = bi && typeof bi === 'object'
    ? {
        buyer: bi.buyer ?? '',
        orderNo: bi.orderNo ?? '',
        styleRef: bi.styleRef ?? '',
        fit: bi.fit ?? '',
        season: bi.season ?? '',
        modified: bi.modified ?? '',
      }
    : { buyer: '', orderNo: '', styleRef: '', fit: '', season: '', modified: '' };
  return normalized;
}

/**
 * Converts legacy section object (measurements, stitchGauge, notes) to array of display items.
 */
function legacySectionToItems(section) {
  const items = [];
  const push = (category, name, value) => {
    if (value != null && value !== '') items.push({ category, name, value, source: 'explicit', relevance: 'gauge' });
  };
  (section.measurements || []).forEach((m) => push('measurement', m.parameter || m.name || 'Measurement', m.value));
  (section.stitchGauge || []).forEach((s) => push('stitch', s.stitch || 'Stitch', [s.spi, s.time].filter(Boolean).join(' ') || s.gauge || '—'));
  (section.notes || []).forEach((n) => push('construction_note', 'Note', typeof n === 'string' ? n : JSON.stringify(n)));
  return items;
}

/**
 * Section display config: key -> human title and order for UI.
 * Matches parser output: collar, sleeve, cuff, pocket, front, back, assembly.
 */
export const TECHPACK_SECTIONS = [
  { key: 'collar', title: 'Collar' },
  { key: 'sleeve', title: 'Sleeve' },
  { key: 'cuff', title: 'Cuff' },
  { key: 'pocket', title: 'Pocket' },
  { key: 'front', title: 'Front' },
  { key: 'back', title: 'Back' },
  { key: 'assembly', title: 'Assembly' },
];
