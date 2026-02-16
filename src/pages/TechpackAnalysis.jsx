import { useState } from 'react';
import { Upload, ChevronDown, AlertCircle } from 'lucide-react';
import { uploadTechPack } from '../api/api';
import { normalizeTechpackResponse, TECHPACK_SECTIONS } from '../lib/techpackUtils';

// Renders a single extracted item (measurement, stitch, process, automation, construction_note)
const ItemRow = ({ item }) => {
  const relevance = item.relevance ?? item.importance;
  return (
    <tr style={styles.itemRow}>
      <td style={styles.cellCategory}>{formatCategory(item.category)}</td>
      <td style={styles.cellName}>{formatName(item.name)}</td>
      <td style={styles.cellValue}>{item.value}</td>
      <td style={styles.cellRelevance}>
        <span style={{ ...styles.relevanceBadge, ...relevanceStyle(relevance) }}>
          {relevance || '—'}
        </span>
      </td>
    </tr>
  );
};

function formatCategory(cat) {
  if (!cat) return '—';
  return String(cat).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatName(name) {
  if (!name) return '—';
  return String(name).replace(/_/g, ' ');
}

function relevanceStyle(relevance) {
  const map = {
    risk: { backgroundColor: '#FDF2F4', color: '#8B1E2D' },
    gauge: { backgroundColor: '#E8F4FD', color: '#1E5A8B' },
    folder: { backgroundColor: '#F5F0E8', color: '#6B5B3D' },
    automation: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
  };
  return map[relevance] || { backgroundColor: '#F0F0F0', color: '#6B6B6B' };
}

// Display-only: move trailing numeric from operation into notes for clarity
function constructionDisplayRow(row) {
  const op = (row.operation || '').trim();
  const notes = (row.notes || '').trim();
  const numericSuffix = op.match(/\s*[–\-—]\s*(\d+(?:\.\d+)?\s*(?:mm|cm)?)\s*$/i);
  if (numericSuffix) {
    const opOnly = op.replace(/\s*[–\-—]\s*\d+(?:\.\d+)?\s*(?:mm|cm)?\s*$/i, '').trim();
    const valueInNotes = numericSuffix[1].trim();
    return { operation: opOnly || op, stitchType: row.stitchType, spiGauge: row.spiGauge, notes: notes ? `${valueInNotes}; ${notes}` : valueInNotes };
  }
  return { operation: op, stitchType: row.stitchType, spiGauge: row.spiGauge, notes: notes };
}
function isConstructionNoiseRow(row) {
  const op = (row.operation || '').trim().toLowerCase();
  if (op === '@ here' || op === '') return true;
  if (op === 'dimension' && !row.stitchType && !row.spiGauge && !row.notes) return true;
  return false;
}
function baseMeasurementParamLabel(param) {
  if (!param) return param;
  let p = param.trim();
  p = p.replace(/^spec\s+actual\s*[:\-]\s*/i, '').replace(/^dimension\s*[:\-]\s*/i, '');
  if (p.toLowerCase() === 'dimension') return '';
  return p || param;
}

// Grading table: layout and display only. No data change, no inference.
const SIZE_COLS_GRADING = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
function isValidGradingParameter(param) {
  if (!param || typeof param !== 'string') return false;
  const p = param.trim();
  if (!p) return false;
  const lower = p.toLowerCase();
  if (lower === 'grading' || lower === 'size') return false;
  if (/^xs\s*\-?\s*$/i.test(p) || lower.startsWith('xs-')) return false;
  if (p.length < 2) return false;
  return true;
}
function stripUnitFromValue(val) {
  if (val == null || val === '') return '';
  const s = String(val).trim();
  return s.replace(/\s*(mm|cm)\s*$/i, '').trim() || s;
}
function inferUnitFromRow(row) {
  for (const col of SIZE_COLS_GRADING) {
    const v = row[col];
    if (v != null && String(v).trim()) {
      if (/mm/i.test(String(v))) return 'mm';
      if (/cm/i.test(String(v))) return 'cm';
    }
  }
  return '';
}
function normalizeGradingRowForDisplay(row) {
  let parameter = (row.parameter || '').trim();
  const noteParts = [];

  const qualifiers = [];
  const rawMatch = parameter.match(/\b(raw|finished|pls\s+note|w\/c\s*lbl)\b/gi);
  if (rawMatch) {
    rawMatch.forEach((q) => qualifiers.push(q));
    parameter = parameter
      .replace(/\s*[(\[]?\s*(raw|finished|pls\s+note|w\/c\s*lbl)\s*[)\]]?\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\s*[(\[]\s*[)\]]\s*/g, '')
      .trim();
  }
  if (qualifiers.length) noteParts.push(qualifiers.join(', '));

  // Move embedded measurements/units out of parameter into notes (display only)
  const trailingMeas = parameter.match(/\s+(\d+(?:\.\d+)?\s*(?:mm|cm)|(?:\d+\s*\/\s*\d+)\s*"?)\s*$/i);
  if (trailingMeas) {
    noteParts.push(trailingMeas[1].trim());
    parameter = parameter.replace(/\s+\d+(?:\.\d+)?\s*(?:mm|cm)\s*$|\s+(?:\d+\s*\/\s*\d+)\s*"?\s*$/i, '').trim();
  }
  const anyMeas = parameter.match(/(\d+(?:\.\d+)?\s*(?:mm|cm)|\d+\s*\/\s*\d+\s*")/gi);
  if (anyMeas) {
    anyMeas.forEach((m) => noteParts.push(m.trim()));
    parameter = parameter
      .replace(/\d+(?:\.\d+)?\s*(?:mm|cm)/gi, ' ')
      .replace(/\d+\s*\/\s*\d+\s*"/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const notes = noteParts.length ? noteParts.join(' · ') : '';
  const unit = inferUnitFromRow(row);
  const sizeCells = {};
  SIZE_COLS_GRADING.forEach((col) => {
    const raw = row[col];
    const numOnly = stripUnitFromValue(raw);
    sizeCells[col] = numOnly === '' ? '' : numOnly;
  });

  parameter = parameter.replace(/\s*[–\-—]\s*$/g, '').trim();
  return { parameter, notes, unit, sizeCells };
}
function getValidGradingRows(rows) {
  return (rows || [])
    .filter((r) => isValidGradingParameter(r.parameter))
    .map(normalizeGradingRowForDisplay)
    .filter((r) => r.parameter.length >= 2 && !/^\d+(\.\d+)?\s*$/.test(r.parameter));
}

// Strict tech-pack view: per component — Construction | Base Measurements | Grading tables
const TechnicalTableView = ({ technicalTable }) => {
  const components = technicalTable?.components ?? [];
  if (components.length === 0) return null;

  return (
    <div style={styles.technicalSection}>
      {components.map((block) => {
        const constructionRows = (block.constructionTable || []).filter((r) => !isConstructionNoiseRow(r)).map(constructionDisplayRow);
        const baseRows = (block.baseMeasurementsTable || []).map((r) => ({ ...r, parameter: baseMeasurementParamLabel(r.parameter) })).filter((r) => r.parameter);
        const gradingRows = getValidGradingRows(block.gradingTable || []);

        const hasConstruction = constructionRows.length > 0;
        const hasBase = baseRows.length > 0;
        const hasGrading = gradingRows.length > 0;
        if (!hasConstruction && !hasBase && !hasGrading) return null;

        return (
          <div key={block.component} style={styles.technicalBlock}>
            <div style={styles.technicalComponentHeader}>
              <h3 style={styles.technicalComponentTitle}>{block.component}</h3>
            </div>

            {hasConstruction && (
              <div style={styles.constructionBlock}>
                <div style={styles.technicalCategoryLabel}>Construction</div>
                <table style={styles.technicalTable}>
                  <thead>
                    <tr>
                      <th style={styles.techTh}>Operation</th>
                      <th style={styles.techTh}>Stitch Type</th>
                      <th style={styles.techTh}>SPI / Gauge</th>
                      <th style={styles.techTh}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {constructionRows.map((row, i) => (
                      <tr key={i} style={styles.techTr}>
                        <td style={styles.techTdOperation}>{row.operation || '—'}</td>
                        <td style={styles.techTd}>{row.stitchType || '—'}</td>
                        <td style={styles.techTd}>{row.spiGauge || '—'}</td>
                        <td style={styles.techTdNotes}>{row.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {hasBase && (
              <div style={styles.baseMeasurementsBlock}>
                <div style={styles.technicalCategoryLabel}>Base Measurements</div>
                <table style={styles.technicalTable}>
                  <thead>
                    <tr>
                      <th style={styles.techTh}>Parameter</th>
                      <th style={styles.techThValue}>Value</th>
                      <th style={styles.techThUnit}>Unit</th>
                      <th style={styles.techThMuted}>Related Operation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baseRows.map((row, i) => (
                      <tr key={i} style={styles.techTr}>
                        <td style={styles.techTdParameter}>{row.parameter || '—'}</td>
                        <td style={styles.techTdValue}>{row.value ?? '—'}</td>
                        <td style={styles.techTdUnit}>{row.unit ?? '—'}</td>
                        <td style={styles.techTdMuted}>{row.relatedOperation || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {hasGrading && (
              <div style={styles.gradingBlock}>
                <div style={styles.gradingTableLabel}>Grading / Size Table</div>
                <table style={styles.gradingTable}>
                  <thead>
                    <tr>
                      <th style={styles.gradingThParam}>Parameter</th>
                      <th style={styles.gradingThUnit}>Unit</th>
                      {SIZE_COLS_GRADING.map((col) => (
                        <th key={col} style={styles.gradingThSize}>{col}</th>
                      ))}
                      <th style={styles.gradingThNotes}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradingRows.map((row, i) => (
                      <tr key={i} style={styles.gradingTr}>
                        <td style={styles.gradingTdParam}>{row.parameter || ''}</td>
                        <td style={styles.gradingTdUnit}>{row.unit || ''}</td>
                        {SIZE_COLS_GRADING.map((col) => (
                          <td key={col} style={styles.gradingTdSize}>
                            {row.sizeCells[col] || ''}
                          </td>
                        ))}
                        <td style={styles.gradingTdNotes}>{row.notes || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Section panel with structured table view for extracted items
const SectionPanel = ({ title, data, isOpen, onToggle }) => {
  const items = Array.isArray(data) ? data : [];
  const hasData = items.length > 0;

  return (
    <div style={{
      ...styles.panel,
      borderColor: isOpen ? '#8B1E2D' : '#E5E5E5',
    }}>
      <button onClick={onToggle} style={styles.panelHeader}>
        <div style={styles.panelTitleRow}>
          <span style={styles.panelTitle}>{title}</span>
          {hasData && (
            <span style={styles.extractedBadge}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        <ChevronDown
          size={20}
          style={{
            ...styles.chevron,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isOpen ? '#8B1E2D' : '#9B9B9B',
          }}
        />
      </button>

      {isOpen && (
        <div style={styles.panelContent}>
          {!hasData ? (
            <div style={styles.emptyState}>No data extracted for this section</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Spec / Name</th>
                    <th style={styles.th}>Value</th>
                    <th style={styles.th}>Relevance</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <ItemRow key={i} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TechPackAnalysis = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const sections = TECHPACK_SECTIONS;

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('techpack', file);

    try {
      const response = await uploadTechPack(formData);
      const raw = response?.data ?? response;
      const normalized = normalizeTechpackResponse(raw);
      setResult(normalized);

      const newExpanded = {};
      sections.forEach((section) => {
        newExpanded[section.key] = (normalized[section.key]?.length ?? 0) > 0;
      });
      setExpandedSections(newExpanded);
    } catch (err) {
      setError(err.userMessage || 'Failed to analyse document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Techpack Analysis</h1>
        <p style={styles.pageSubtitle}>
          Upload tech pack PDF for section-wise extraction
        </p>
      </div>

      {/* Upload Zone */}
      <div style={styles.uploadCard}>
        <div
          style={styles.dropZone}
          onClick={() => document.getElementById('techpack-upload').click()}
        >
          <Upload size={32} color="#8B1E2D" />
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: 'none' }}
            id="techpack-upload"
          />
          <span style={styles.dropLabel}>
            {file ? file.name : 'Drop Tech Pack PDF here or click to browse'}
          </span>
          <p style={styles.fileHint}>Accepted format: PDF | Max size: 10MB</p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            ...styles.analyseBtn,
            opacity: !file || loading ? 0.5 : 1,
            cursor: !file || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Analysing Document...' : 'Analyse Document'}
        </button>

        {error && (
          <div style={styles.errorMessage}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div style={styles.resultsSection}>
          {(() => {
            const base = result.baseInformation || {};
            const hasBase = [base.buyer, base.orderNo, base.styleRef, base.fit].some(Boolean);
            return hasBase ? (
              <div style={styles.baseInfoBlock}>
                <div style={styles.baseInfoLabel}>Base information</div>
                <div style={styles.baseInfoGrid}>
                  {base.buyer && (
                    <div style={styles.baseInfoItem}>
                      <span style={styles.baseInfoKey}>Buyer</span>
                      <span style={styles.baseInfoValue}>{base.buyer}</span>
                    </div>
                  )}
                  {base.orderNo && (
                    <div style={styles.baseInfoItem}>
                      <span style={styles.baseInfoKey}>Con no.</span>
                      <span style={styles.baseInfoValue}>{base.orderNo}</span>
                    </div>
                  )}
                  {base.styleRef && (
                    <div style={styles.baseInfoItem}>
                      <span style={styles.baseInfoKey}>Style</span>
                      <span style={styles.baseInfoValue}>{base.styleRef}</span>
                    </div>
                  )}
                  {base.fit && (
                    <div style={styles.baseInfoItem}>
                      <span style={styles.baseInfoKey}>Fit</span>
                      <span style={styles.baseInfoValue}>{base.fit}</span>
                    </div>
                  )}
                  {base.season && (
                    <div style={styles.baseInfoItem}>
                      <span style={styles.baseInfoKey}>Season</span>
                      <span style={styles.baseInfoValue}>{base.season}</span>
                    </div>
                  )}
                  {base.modified && (
                    <div style={styles.baseInfoItem}>
                      <span style={styles.baseInfoKey}>Modified</span>
                      <span style={styles.baseInfoValue}>{base.modified}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null;
          })()}
          <div style={styles.resultsHeader}>
            <div>
              <h2 style={styles.resultsTitle}>
                {result.technicalTable?.components?.length ? 'Technical breakdown' : 'Extraction Results'}
              </h2>
              <p style={styles.resultsSubtitle}>
                {file?.name} — construction &amp; measurement only
              </p>
            </div>
            {!result.technicalTable?.components?.length && (
              <button
                onClick={() => {
                  const allOpen = Object.values(expandedSections).every(v => v);
                  const newState = sections.reduce((acc, s) => ({
                    ...acc,
                    [s.key]: !allOpen
                  }), {});
                  setExpandedSections(newState);
                }}
                style={styles.toggleAllBtn}
              >
                {Object.values(expandedSections).every(v => v) ? 'Collapse All' : 'Expand All'}
              </button>
            )}
          </div>

          {result.technicalTable?.components?.length > 0 ? (
            <TechnicalTableView technicalTable={result.technicalTable} />
          ) : (
            <div style={styles.panelsContainer}>
              {sections.map((section) => (
                <SectionPanel
                  key={section.key}
                  title={section.title.toUpperCase()}
                  data={result[section.key]}
                  isOpen={expandedSections[section.key]}
                  onToggle={() => toggleSection(section.key)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  pageHeader: {
    marginBottom: '28px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#8B1E2D',
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#6B6B6B',
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '48px',
    backgroundColor: '#FAFAFA',
    border: '2px dashed #D5D5D5',
    borderRadius: '10px',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  dropLabel: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#2B2B2B',
    cursor: 'pointer',
  },
  fileHint: {
    fontSize: '13px',
    color: '#9B9B9B',
  },
  analyseBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#8B1E2D',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 600,
    transition: 'all 200ms ease',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '16px',
    padding: '14px 16px',
    backgroundColor: '#FDF2F4',
    border: '1px solid #F5D5D8',
    borderRadius: '8px',
    color: '#8B1E2D',
    fontSize: '14px',
  },
  resultsSection: {
    marginTop: '40px',
  },
  baseInfoBlock: {
    marginBottom: '24px',
    padding: '20px 24px',
    backgroundColor: '#F8F9FA',
    border: '1px solid #E8E8E8',
    borderRadius: '10px',
  },
  baseInfoLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#6B6B6B',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '14px',
  },
  baseInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px 24px',
  },
  baseInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  baseInfoKey: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#7A7A7A',
  },
  baseInfoValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#2B2B2B',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  resultsTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#2B2B2B',
    letterSpacing: '0.02em',
    marginBottom: '4px',
  },
  resultsSubtitle: {
    fontSize: '13px',
    color: '#9B9B9B',
  },
  toggleAllBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #D5D5D5',
    borderRadius: '8px',
    color: '#6B6B6B',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  panelsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  technicalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  technicalBlock: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  technicalComponentHeader: {
    padding: '20px 24px 16px',
    borderBottom: '2px solid #E8E8E8',
    backgroundColor: '#FAFAFA',
  },
  technicalComponentTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#8B1E2D',
    margin: 0,
    letterSpacing: '0.02em',
  },
  technicalCategoryLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#6B6B6B',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  constructionBlock: {
    padding: '24px 24px 28px',
    borderBottom: '1px solid #EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  baseMeasurementsBlock: {
    padding: '24px 24px 28px',
    borderBottom: '1px solid #EEEEEE',
    backgroundColor: '#F8F9FA',
  },
  gradingBlock: {
    padding: '28px 28px 32px',
    backgroundColor: '#FFFFFF',
    overflowX: 'auto',
  },
  gradingTableLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#6B6B6B',
    marginBottom: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  gradingTable: {
    width: '100%',
    minWidth: '720px',
    borderCollapse: 'collapse',
    fontSize: '15px',
  },
  gradingTr: {
    borderBottom: '1px solid #E8E8E8',
  },
  gradingTdParam: {
    padding: '18px 16px',
    color: '#2B2B2B',
    verticalAlign: 'middle',
    fontWeight: 500,
    fontSize: '15px',
    minWidth: '140px',
    maxWidth: '220px',
  },
  gradingTdUnit: {
    padding: '18px 16px',
    color: '#7A7A7A',
    verticalAlign: 'middle',
    fontWeight: 400,
    fontSize: '14px',
    width: '56px',
  },
  gradingTdSize: {
    padding: '18px 16px',
    color: '#1A1A1A',
    verticalAlign: 'middle',
    fontWeight: 600,
    fontSize: '15px',
    textAlign: 'right',
    minWidth: '56px',
    width: '56px',
  },
  gradingTdNotes: {
    padding: '18px 16px',
    color: '#7A7A7A',
    verticalAlign: 'middle',
    fontWeight: 400,
    fontSize: '14px',
    minWidth: '100px',
    maxWidth: '200px',
  },
  gradingThSize: {
    textAlign: 'right',
    padding: '16px 16px',
    borderBottom: '2px solid #E0E0E0',
    color: '#5A5A5A',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    minWidth: '56px',
    width: '56px',
  },
  gradingThParam: {
    textAlign: 'left',
    padding: '16px 16px',
    borderBottom: '2px solid #E0E0E0',
    color: '#5A5A5A',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    minWidth: '140px',
  },
  gradingThUnit: {
    textAlign: 'left',
    padding: '16px 16px',
    borderBottom: '2px solid #E0E0E0',
    color: '#5A5A5A',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    width: '56px',
  },
  gradingThNotes: {
    textAlign: 'left',
    padding: '16px 16px',
    borderBottom: '2px solid #E0E0E0',
    color: '#8A8A8A',
    fontWeight: 500,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    minWidth: '100px',
  },
  technicalTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '15px',
  },
  techTh: {
    textAlign: 'left',
    padding: '14px 16px',
    borderBottom: '2px solid #E5E5E5',
    color: '#5A5A5A',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  techThValue: {
    textAlign: 'right',
    padding: '14px 16px',
    borderBottom: '2px solid #E5E5E5',
    color: '#5A5A5A',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  techThUnit: {
    textAlign: 'left',
    padding: '14px 16px',
    borderBottom: '2px solid #E5E5E5',
    color: '#5A5A5A',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  techThMuted: {
    textAlign: 'left',
    padding: '14px 16px',
    borderBottom: '2px solid #E5E5E5',
    color: '#8A8A8A',
    fontWeight: 500,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  techTr: {
    borderBottom: '1px solid #F0F0F0',
  },
  techTd: {
    padding: '16px 16px',
    color: '#2B2B2B',
    verticalAlign: 'middle',
    fontSize: '15px',
  },
  techTdOperation: {
    padding: '16px 16px',
    color: '#2B2B2B',
    verticalAlign: 'middle',
    fontWeight: 500,
    fontSize: '15px',
  },
  techTdNotes: {
    padding: '16px 16px',
    color: '#5A5A5A',
    verticalAlign: 'middle',
    fontSize: '14px',
  },
  techTdParameter: {
    padding: '16px 16px',
    color: '#2B2B2B',
    verticalAlign: 'middle',
    fontWeight: 500,
    fontSize: '15px',
  },
  techTdValue: {
    padding: '16px 16px',
    color: '#1A1A1A',
    verticalAlign: 'middle',
    fontWeight: 600,
    fontSize: '15px',
    textAlign: 'right',
  },
  techTdUnit: {
    padding: '16px 16px',
    color: '#6B6B6B',
    verticalAlign: 'middle',
    fontWeight: 400,
    fontSize: '14px',
  },
  techTdMuted: {
    padding: '16px 16px',
    color: '#8A8A8A',
    verticalAlign: 'middle',
    fontSize: '14px',
  },
  techThGradingSize: {
    textAlign: 'right',
    padding: '12px 14px',
    borderBottom: '2px solid #E5E5E5',
    color: '#5A5A5A',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  techTdGradingValue: {
    padding: '14px 14px',
    color: '#1A1A1A',
    verticalAlign: 'middle',
    fontWeight: 600,
    fontSize: '14px',
    textAlign: 'right',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    transition: 'border-color 200ms ease',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '18px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  panelTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#2B2B2B',
    letterSpacing: '0.05em',
  },
  extractedBadge: {
    padding: '4px 10px',
    backgroundColor: '#FDF2F4',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#8B1E2D',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  chevron: {
    transition: 'transform 200ms ease',
  },
  panelContent: {
    padding: '20px',
    borderTop: '1px solid #F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
    color: '#9B9B9B',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '2px solid #E5E5E5',
    color: '#6B6B6B',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  itemRow: {
    borderBottom: '1px solid #F0F0F0',
  },
  cellCategory: {
    padding: '10px 12px',
    color: '#2B2B2B',
    fontWeight: 500,
    verticalAlign: 'top',
  },
  cellName: {
    padding: '10px 12px',
    color: '#4A4A4A',
    verticalAlign: 'top',
  },
  cellValue: {
    padding: '10px 12px',
    color: '#2B2B2B',
    fontWeight: 500,
    verticalAlign: 'top',
  },
  cellRelevance: {
    padding: '10px 12px',
    verticalAlign: 'top',
  },
  relevanceBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
};

export default TechPackAnalysis;
