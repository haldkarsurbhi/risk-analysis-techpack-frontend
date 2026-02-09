import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Building2, User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [factoryCode, setFactoryCode] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/techpack');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <Logo size="large" />
          <p style={styles.subtitle}>
            Apparel Specification & Risk Intelligence System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Building2 size={14} style={styles.labelIcon} />
              Factory Code
            </label>
            <input
              type="text"
              value={factoryCode}
              onChange={(e) => setFactoryCode(e.target.value)}
              placeholder="e.g., BGL-04-APP"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <User size={14} style={styles.labelIcon} />
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your operator ID"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Lock size={14} style={styles.labelIcon} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure access key"
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Authenticating...' : 'Access System'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.securityNote}>
            Authorized personnel only. All access is monitored and logged.
          </p>
          <p style={styles.version}>Style Analyser Enterprise v2.4</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '48px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  header: {
    marginBottom: '40px',
  },
  subtitle: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#4A4A4A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  labelIcon: {
    color: '#8B1E2D',
  },
  input: {
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D5D5D5',
    borderRadius: '10px',
    color: '#2B2B2B',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 200ms ease',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '8px',
    padding: '16px',
    backgroundColor: '#8B1E2D',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    transition: 'all 200ms ease',
  },
  footer: {
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid #EEEEEE',
    textAlign: 'center',
  },
  securityNote: {
    fontSize: '12px',
    color: '#9B9B9B',
    marginBottom: '8px',
  },
  version: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
};

export default Login;
