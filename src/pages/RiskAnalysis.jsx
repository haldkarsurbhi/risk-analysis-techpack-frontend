import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const RiskCard = ({ level, count, issues }) => {
  const config = {
    high: {
      icon: ShieldAlert,
      color: '#8B1E2D',
      bgColor: '#FDF2F4',
      label: 'High Risk',
    },
    medium: {
      icon: AlertTriangle,
      color: '#C4841A',
      bgColor: '#FDF6E9',
      label: 'Medium Risk',
    },
    low: {
      icon: AlertCircle,
      color: '#5A5A5A',
      bgColor: '#F5F5F5',
      label: 'Low Risk',
    },
  };

  const { icon: Icon, color, bgColor, label } = config[level];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ ...styles.iconWrapper, backgroundColor: bgColor }}>
          <Icon size={24} color={color} strokeWidth={2} />
        </div>
        <div>
          <div style={{ ...styles.count, color }}>{count}</div>
          <div style={styles.label}>{label}</div>
        </div>
      </div>
      <div style={styles.issuesList}>
        {issues.map((issue, i) => (
          <div key={i} style={styles.issueItem}>
            <div style={{ ...styles.issueDot, backgroundColor: color }} />
            <span style={styles.issueText}>{issue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiskRow = ({ operation, section, issue, level }) => {
  const levelConfig = {
    High: { color: '#8B1E2D', bg: '#FDF2F4', label: 'HIGH' },
    Medium: { color: '#C4841A', bg: '#FDF6E9', label: 'MEDIUM' },
    Low: { color: '#5A5A5A', bg: '#F5F5F5', label: 'LOW' },
  };
  
  const config = levelConfig[level] || levelConfig.Low;

  return (
    <tr style={styles.tableRow}>
      <td style={styles.tableCell}>
        <div style={styles.operationName}>{operation}</div>
      </td>
      <td style={styles.tableCell}>
        <span style={styles.sectionTag}>{section}</span>
      </td>
      <td style={styles.tableCell}>
        <div style={styles.issueText}>{issue}</div>
      </td>
      <td style={styles.tableCell}>
        <span style={{ ...styles.levelBadge, backgroundColor: config.bg, color: config.color }}>
          {config.label}
        </span>
      </td>
    </tr>
  );
};

const RiskAnalysis = () => {
  const risks = [
    { operation: 'Collar Attachment', section: 'Collar', issue: 'Complex curvature requires skilled operator', level: 'High' },
    { operation: 'Topstitching', section: 'Collar', issue: 'Visibility critical - quality risk', level: 'High' },
    { operation: 'Buttonhole Placement', section: 'Front', issue: 'Precision required for alignment', level: 'Medium' },
    { operation: 'Pocket Setting', section: 'Front', issue: 'Multiple layers - needle breakage risk', level: 'Medium' },
    { operation: 'Side Seam', section: 'Assembly', issue: 'Standard operation', level: 'Low' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Risk Check</h1>
        <p style={styles.pageSubtitle}>Construction and process risk assessment</p>
      </div>

      {/* Risk Summary Cards */}
      <div style={styles.cardsGrid}>
        <RiskCard 
          level="high" 
          count="2" 
          issues={['Collar curvature', 'Topstitch visibility']} 
        />
        <RiskCard 
          level="medium" 
          count="2" 
          issues={['Buttonhole alignment', 'Pocket layers']} 
        />
        <RiskCard 
          level="low" 
          count="1" 
          issues={['Standard operations']} 
        />
      </div>

      {/* Detailed Risk Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>Risk Assessment Details</h2>
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.tableHeadCell}>Operation</th>
              <th style={styles.tableHeadCell}>Section</th>
              <th style={styles.tableHeadCell}>Risk Description</th>
              <th style={styles.tableHeadCell}>Level</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk, i) => (
              <RiskRow key={i} {...risk} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Guidelines */}
      <div style={styles.guidelinesCard}>
        <h3 style={styles.guidelinesTitle}>Risk Mitigation Guidelines</h3>
        <div style={styles.guidelinesGrid}>
          <div style={styles.guidelineItem}>
            <span style={{...styles.guidelineLabel, color: '#8B1E2D'}}>High Risk</span>
            <p style={styles.guidelineText}>Require skilled operators. Implement 100% inline inspection. Consider jigs/fixtures.</p>
          </div>
          <div style={styles.guidelineItem}>
            <span style={{...styles.guidelineLabel, color: '#C4841A'}}>Medium Risk</span>
            <p style={styles.guidelineText}>Standard operators with supervision. Spot checks at 30% frequency.</p>
          </div>
          <div style={styles.guidelineItem}>
            <span style={{...styles.guidelineLabel, color: '#5A5A5A'}}>Low Risk</span>
            <p style={styles.guidelineText}>General operators. Standard quality checks apply.</p>
          </div>
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #F0F0F0',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: '32px',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '4px',
  },
  label: {
    fontSize: '13px',
    color: '#6B6B6B',
    fontWeight: 600,
  },
  issuesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  issueItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#4A4A4A',
  },
  issueDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    marginBottom: '24px',
  },
  tableHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #F0F0F0',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#2B2B2B',
    letterSpacing: '0.02em',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeadRow: {
    backgroundColor: '#FAFAFA',
  },
  tableHeadCell: {
    padding: '14px 24px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 700,
    color: '#6B6B6B',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  tableRow: {
    borderTop: '1px solid #F0F0F0',
  },
  tableCell: {
    padding: '16px 24px',
    fontSize: '14px',
  },
  operationName: {
    fontWeight: 600,
    color: '#2B2B2B',
  },
  sectionTag: {
    padding: '6px 12px',
    backgroundColor: '#F5F5F5',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#8B1E2D',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  issueText: {
    color: '#4A4A4A',
    maxWidth: '400px',
    lineHeight: 1.5,
  },
  levelBadge: {
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  guidelinesCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  guidelinesTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#2B2B2B',
    marginBottom: '20px',
    letterSpacing: '0.02em',
  },
  guidelinesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  guidelineItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  guidelineLabel: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  guidelineText: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: 1.6,
  },
};

export default RiskAnalysis;
