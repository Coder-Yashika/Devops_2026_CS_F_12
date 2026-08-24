import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import RegisterStudent from './pages/auth/RegisterStudent';
import RegisterFaculty from './pages/auth/RegisterFaculty';
import VerifyOtp from './pages/auth/VerifyOtp';

// Dashboards (Student/Faculty/Admin) come in Phase 9 - these routes will
// point at real components then. For now they're just enough so login
// redirects don't 404.
function Placeholder({ label }) {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ color: 'var(--text-primary)' }}>
      {label} dashboard — coming in a later phase
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/faculty" element={<RegisterFaculty />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/student" element={<Placeholder label="Student" />} />
        <Route path="/faculty" element={<Placeholder label="Faculty" />} />
        <Route path="/admin" element={<Placeholder label="Admin" />} />
      </Routes>
    </BrowserRouter>
  );
}
