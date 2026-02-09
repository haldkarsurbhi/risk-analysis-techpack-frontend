import { useState } from 'react';
import { Upload, ChevronDown, Ruler, Wrench, FileText, AlertCircle, Info } from 'lucide-react';
import { uploadTechPack } from '../api/api';

// Section Panel Component
const SectionPanel = ({ title, data, isOpen, onToggle }) => {
  const hasData = data && (
    data.type || 
    data.measurements?.length > 0 || 
    data.stitchGauge?.length > 0 ||
    data.notes?.length > 0
  );

  return (
    <div style={{
      ...styles.panel,
      borderColor: isOpen ? '#8B1E2D' : '#E5E5E5',
    }}>
      <button onClick={onToggle} style={styles.panelHeader}>
        <div style={styles.panelTitleRow}>
          <span style={styles.panelTitle}>{title}</span>
          {hasData && <span style={styles.extractedBadge}>SPECIFIED</span>}
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
            <div style={styles.emptyState}>
              <Info size={16} color="#9B9B9B" />
              <span style={styles.emptyText}>Not specified in tech pack</span>
            </div>
          ) : (
            <div style={styles.contentGrid}>
              {/* Type */}
              {data.type && (
                <div style={styles.contentBlock}>
                  <div style={styles.blockLabel}>Type</div>
                  <div style={styles.blockValue}>{data.type}</div>
                </div>
              )}

              {/* Measurements Table */}
              {data.measurements?.length > 0 && (
                <div style={{...styles.contentBlock, gridColumn: '1 / -1'}}>
                  <div style={styles.blockLabel}>
                    <Ruler size={14} style={styles.blockIcon} />
                    Measurements
                  </div>
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.tableTh}>Parameter</th>
                          <th style={styles.tableTh}>Value</th>
                          <th style={styles.tableTh}>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.measurements.map((m, i) => (
                          <tr key={i}>
                            <td style={styles.tableTd}>{m.parameter}</td>
                            <td style={{...styles.tableTd, fontWeight: 600}}>{m.value}</td>
                            <td style={styles.tableTd}>{m.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Stitch & Gauge */}
              {data.stitchGauge?.length > 0 && (
                <div style={{...styles.contentBlock, gridColumn: '1 / -1'}}>
                  <div style={styles.blockLabel}>
                    <Wrench size={14} style={styles.blockIcon} />
                    Stitch & Gauge
                  </div>
                  <div style={styles.stitchGrid}>
                    {data.stitchGauge.map((sg, i) => (
                      <div key={i} style={styles.stitchCard}>
                        {sg.stitch && (
                          <div style={styles.stitchRow}>
                            <span style={styles.stitchLabel}>Stitch</span>
                            <span style={styles.stitchValue}>{sg.stitch}</span>
                          </div>
                        )}
                        {sg.spi && (
                          <div style={styles.stitchRow}>
                            <span style={styles.stitchLabel}>SPI</span>
                            <span style={styles.stitchValue}>{sg.spi}</span>
                          </div>
                        )}
                        {sg.gauge && (
                          <div style={styles.stitchRow}>
                            <span style={styles.stitchLabel}>Gauge</span>
                            <span style={styles.stitchValue}>{sg.gauge}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes / Sequence */}
              {data.notes?.length > 0 && (
                <div style={{ ...styles.contentBlock, gridColumn: '1 / -1' }}>
                  <div style={styles.blockLabel}>
                    <FileText size={14} style={styles.blockIcon} />
                    Notes / Sequence
                  </div>
                  <ol style={styles.notesList}>
                    {data.notes.map((note, i) => (
                      <li key={i} style={styles.noteItem}>
                        {note}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
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

  // Standard tech pack sections
  const sections = [
    { key: 'collar', title: 'COLLAR' },
    { key: 'assembly', title: 'ASSEMBLY' },
    { key: 'yoke', title: 'YOKE' },
    { key: 'front', title: 'FRONT' },
    { key: 'back', title: 'BACK' },
    { key: 'pocket', title: 'POCKET' },
  ];

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('techpack', file);

    try {
      const response = await uploadTechPack(formData);
      
      // Handle the new response structure
      const parsedData = response.data || response;
      setResult(parsedData);
      
      // Auto-expand sections with data
      const newExpanded = {};
      sections.forEach(section => {
        const data = parsedData[section.key];
        const hasData = data?.type || data?.measurements?.length || data?.stitchGauge?.length;
        newExpanded[section.key] = !!hasData;
      });
      setExpandedSections(newExpanded);
    } catch (err) {
      setError(err.userMessage || 'Failed to analyse document');
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
          <div style={styles.resultsHeader}>
            <div>
              <h2 style={styles.resultsTitle}>Extraction Results</h2>
              <p style={styles.resultsSubtitle}>
                {file?.name} • {new Date().toLocaleDateString()}
              </p>
            </div>
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
          </div>

          <div style={styles.panelsContainer}>
            {sections.map(section => (
              <SectionPanel
                key={section.key}
                title={section.title}
                data={result[section.key]}
                isOpen={expandedSections[section.key]}
                onToggle={() => toggleSection(section.key)}
              />
            ))}
          </div>
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
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  contentBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  blockLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#6B6B6B',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  blockIcon: {
    color: '#8B1E2D',
  },
  blockValue: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#2B2B2B',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  tableTh: {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 700,
    color: '#6B6B6B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: '#F5F5F5',
    borderBottom: '1px solid #E5E5E5',
  },
  tableTd: {
    padding: '12px 16px',
    borderBottom: '1px solid #F0F0F0',
    color: '#4A4A4A',
  },
  stitchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '12px',
  },
  stitchCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
  },
  stitchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stitchLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  stitchValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#2B2B2B',
  },
  notesList: {
    listStyle: 'none',
    counterReset: 'note',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  noteItem: {
    counterIncrement: 'note',
    position: 'relative',
    padding: '12px 16px 12px 40px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#4A4A4A',
    lineHeight: 1.5,
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
  emptyText: {
    color: '#9B9B9B',
  },
};

export default TechPackAnalysis;
