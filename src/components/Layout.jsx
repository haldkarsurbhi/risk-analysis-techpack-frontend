import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F7F7F7',
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    padding: '40px 48px',
    minHeight: '100vh',
  },
};

export default Layout;
