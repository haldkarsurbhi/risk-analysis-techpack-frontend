import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { 
  ScanLine, 
  ShieldAlert, 
  BarChart2, 
  FileText,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/techpack', label: 'Techpack Analysis', icon: ScanLine },
    { path: '/risk', label: 'Risk Analyzer', icon: ShieldAlert },
    { path: '/criticality', label: 'Complexity', icon: BarChart2 },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  return (
    <aside style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <Logo size="default" />
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.sectionLabel}>OPERATIONS</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? '#FDF2F4' : 'transparent',
                borderLeftColor: isActive ? '#8B1E2D' : 'transparent',
                color: isActive ? '#8B1E2D' : '#6B6B6B',
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span style={styles.navLabel}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} strokeWidth={1.5} />
          <span>Exit System</span>
        </button>
        <div style={styles.version}>v2.4.1</div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E5E5E5',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 100,
  },
  header: {
    padding: '24px 20px',
    borderBottom: '1px solid #EEEEEE',
  },
  nav: {
    flex: 1,
    padding: '20px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionLabel: {
    padding: '0 12px 12px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#9B9B9B',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '6px',
    borderLeft: '3px solid transparent',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 200ms ease',
  },
  navLabel: {
    flex: 1,
  },
  footer: {
    padding: '16px',
    borderTop: '1px solid #EEEEEE',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    color: '#6B6B6B',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  version: {
    marginTop: '12px',
    padding: '0 12px',
    fontSize: '11px',
    color: '#9B9B9B',
  },
};

export default Sidebar;
