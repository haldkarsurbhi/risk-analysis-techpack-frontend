import { BarChart2, Clock, Users, Gauge } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>
      <Icon size={20} color="#8B1E2D" strokeWidth={2} />
    </div>
    <div>
      <div style={styles.statValue}>{value}<span style={styles.statUnit}>{unit}</span></div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

const ComplexityBar = ({ label, value, level }) => {
  const colors = {
    High: '#8B1E2D',
    Medium: '#C4841A',
    Low: '#5A5A5A',
  };

  return (
    <div style={styles.barContainer}>
      <div style={styles.barHeader}>
        <span style={styles.barLabel}>{label}</span>
        <span style={{ ...styles.barLevel, color: colors[level] }}>{level}</span>
      </div>
      <div style={styles.barTrack}>
        <div style={{ 
          ...styles.barFill, 
          width: `${value}%`,
          backgroundColor: colors[level],
        }} />
      </div>
      <div style={styles.barValue}>{value}% Complexity</div>
    </div>
  );
};

const Criticality = () => {
  const styles_data = [
    { name: 'Dress Shirt - Long Sleeve', value: 78, level: 'High' },
    { name: 'Casual Shirt - Short Sleeve', value: 52, level: 'Medium' },
    { name: 'Basic T-Shirt', value: 28, level: 'Low' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Complexity</h1>
        <p style={styles.pageSubtitle}>Production difficulty and resource assessment</p>
      </div>

      {/* Overview Stats */}
      <div style={styles.overviewCard}>
        <div style={styles.scoreSection}>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreValue}>72</span>
            <span style={styles.scoreUnit}>%</span>
          </div>
          <div>
            <div style={styles.scoreLabel}>Overall Complexity</div>
            <div style={styles.scoreSubtext}>Based on construction analysis</div>
          </div>
        </div>
        <div style={styles.statsDivider} />
        <div style={styles.statsGrid}>
          <StatCard icon={Clock} label="Avg Cycle Time" value="4.2" unit="hrs" />
          <StatCard icon={Users} label="Skill Required" value="Advanced" unit="" />
          <StatCard icon={Gauge} label="Machine Util" value="68" unit="%" />
        </div>
      </div>

      {/* Complexity Breakdown */}
      <div style={styles.breakdownCard}>
        <div style={styles.breakdownHeader}>
          <BarChart2 size={18} color="#8B1E2D" />
          <h2 style={styles.breakdownTitle}>Style Complexity Ratings</h2>
        </div>
        <div style={styles.barsContainer}>
          {styles_data.map((s, i) => (
            <ComplexityBar key={i} {...s} />
          ))}
        </div>
      </div>

      {/* IE Notes */}
      <div style={styles.notesCard}>
        <h3 style={styles.notesTitle}>IE Team Recommendations</h3>
        <ul style={styles.notesList}>
          <li style={styles.noteItem}>
            <span style={styles.noteBullet}>•</span>
            Complexity score of 72% indicates high-skill operations required
          </li>
          <li style={styles.noteItem}>
            <span style={styles.noteBullet}>•</span>
            Allocate experienced operators for collar and cuff operations
          </li>
          <li style={styles.noteItem}>
            <span style={styles.noteBullet}>•</span>
            Consider pre-production training for buttonhole machine operators
          </li>
          <li style={styles.noteItem}>
            <span style={styles.noteBullet}>•</span>
            Target efficiency: 75% first week, 85% by week three
          </li>
        </ul>
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
  overviewCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  scoreSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  scoreCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '3px solid #8B1E2D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
  },
  scoreValue: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#2B2B2B',
  },
  scoreUnit: {
    fontSize: '16px',
    color: '#9B9B9B',
  },
  scoreLabel: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#2B2B2B',
    marginBottom: '4px',
  },
  scoreSubtext: {
    fontSize: '13px',
    color: '#9B9B9B',
  },
  statsDivider: {
    width: '1px',
    height: '80px',
    backgroundColor: '#E5E5E5',
  },
  statsGrid: {
    display: 'flex',
    gap: '40px',
    flex: 1,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  statIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#FDF2F4',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#2B2B2B',
  },
  statUnit: {
    fontSize: '14px',
    color: '#9B9B9B',
    marginLeft: '2px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
    marginTop: '2px',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    marginBottom: '24px',
  },
  breakdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #F0F0F0',
  },
  breakdownTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#2B2B2B',
    letterSpacing: '0.02em',
  },
  barsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  barHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#2B2B2B',
  },
  barLevel: {
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 10px',
    backgroundColor: '#F5F5F5',
    borderRadius: '4px',
  },
  barTrack: {
    height: '8px',
    backgroundColor: '#F0F0F0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 500ms ease',
  },
  barValue: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  notesCard: {
    backgroundColor: '#FDF9E8',
    border: '1px solid #F5E6C8',
    borderRadius: '12px',
    padding: '24px',
  },
  notesTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#6B5B3D',
    marginBottom: '16px',
    letterSpacing: '0.02em',
  },
  notesList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  noteItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '14px',
    color: '#6B5B3D',
    lineHeight: 1.6,
  },
  noteBullet: {
    color: '#C4841A',
    fontWeight: 700,
  },
};

export default Criticality;
