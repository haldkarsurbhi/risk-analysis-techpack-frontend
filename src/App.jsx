import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import TechPackAnalysis from './pages/TechPackAnalysis';
import RiskAnalysis from './pages/RiskAnalysis';
import Criticality from './pages/Criticality';
import Reports from './pages/Reports';

const isAuthenticated = () => localStorage.getItem('isLoggedIn') === 'true';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="techpack" element={<TechPackAnalysis />} />
        <Route path="risk" element={<RiskAnalysis />} />
        <Route path="criticality" element={<Criticality />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
