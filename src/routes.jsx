import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TechpackAnalysis from "./pages/TechpackAnalysis";
import RiskAnalysis from "./pages/RiskAnalysis";
import Criticality from "./pages/Criticality";
import Report from "./pages/Report";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function RoutesConfig() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes with Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/techpack" element={<TechpackAnalysis />} />
          <Route path="/risk" element={<RiskAnalysis />} />
          <Route path="/criticality" element={<Criticality />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Route>
    </Routes>
  );
}
