import { FileText, Download, Calendar, FileSpreadsheet } from 'lucide-react';

const ReportItem = ({ title, type, date, size }) => {
  const isPDF = type === 'PDF';
  
  return (
    <div style={styles.reportItem}>
      <div style={styles.reportIcon}>
        {isPDF ? (
          <FileText size={22} color="#8B1E2D" />
        ) : (
          <FileSpreadsheet size={22} color="#2D6B1E" />
        )}
      </div>
      <div style={styles.reportInfo}>
        <div style={styles.reportTitle}>{title}</div>
        <div style={styles.reportMeta}>
          <span style={{...styles.reportType, color: isPDF ? '#8B1E2D' : '#2D6B1E'}}>{type}</span>
          <span style={styles.metaDot}>•</span>
          <span style={styles.metaText}>{date}</span>
          <span style={styles.metaDot}>•</span>
          <span style={styles.metaText}>{size}</span>
        </div>
      </div>
      <button style={styles.downloadBtn}>
        <Download size={16} />
        <span>Download</span>
      </button>
    </div>
  );
};

const Reports = () => {
  const reports = [
    { title: 'Tech Pack Analysis - Style #4421', type: 'PDF', date: '02 Feb 2026', size: '2.4 MB' },
    { title: 'Risk Assessment Report - Q1 2026', type: 'Excel', date: '01 Feb 2026', size: '1.8 MB' },
    { title: 'Complexity Matrix Summary', type: 'PDF', date: '30 Jan 2026', size: '856 KB' },
    { title: 'Production Line Efficiency Analysis', type: 'Excel', date: '28 Jan 2026', size: '4.2 MB' },
    { title: 'Quality Control Audit Report', type: 'PDF', date: '25 Jan 2026', size: '3.1 MB' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Reports</h1>
        <p style={styles.pageSubtitle}>Generated analysis and documentation</p>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <Calendar size={16} color="#6B6B6B" />
          <select style={styles.select}>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <FileText size={16} color="#6B6B6B" />
          <select style={styles.select}>
            <option>All types</option>
            <option>PDF Reports</option>
            <option>Excel Files</option>
          </select>
        </div>
        <button style={styles.generateBtn}>
          Generate Report
        </button>
      </div>

      {/* Reports List */}
      <div style={styles.reportsContainer}>
        {reports.map((report, i) => (
          <ReportItem key={i} {...report} />
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span style={styles.paginationText}>Showing 5 of 24 reports</span>
        <div style={styles.paginationButtons}>
          <button style={styles.pageBtn}>Previous</button>
          <button style={styles.pageBtn}>Next</button>
        </div>
      </div>
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
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  select: {
    padding: '10px 14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    color: '#4A4A4A',
    fontSize: '13px',
    fontWeight: 500,
    minWidth: '140px',
  },
  generateBtn: {
    marginLeft: 'auto',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #8B1E2D',
    borderRadius: '8px',
    color: '#8B1E2D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  reportsContainer: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  reportItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 24px',
    borderBottom: '1px solid #F0F0F0',
    transition: 'background-color 200ms ease',
  },
  reportIcon: {
    width: '44px',
    height: '44px',
    backgroundColor: '#FDF2F4',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#2B2B2B',
    marginBottom: '6px',
    letterSpacing: '0.01em',
  },
  reportMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
  },
  reportType: {
    fontWeight: 700,
  },
  metaDot: {
    color: '#C5C5C5',
  },
  metaText: {
    color: '#9B9B9B',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: 'transparent',
    border: '1px solid #8B1E2D',
    borderRadius: '8px',
    color: '#8B1E2D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '0 8px',
  },
  paginationText: {
    fontSize: '13px',
    color: '#9B9B9B',
  },
  paginationButtons: {
    display: 'flex',
    gap: '8px',
  },
  pageBtn: {
    padding: '8px 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    color: '#6B6B6B',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
};

export default Reports;
