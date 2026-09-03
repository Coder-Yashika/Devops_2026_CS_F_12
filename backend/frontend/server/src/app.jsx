import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ApplyODS from "./pages/ApplyODS";

function App() {
  return (
    <Routes>

      {/* Authentication */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/student/apply-ods"
        element={<ApplyODS />}
      />

      {/* Faculty */}
      <Route
        path="/faculty/dashboard"
        element={<FacultyDashboard />}
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

    </Routes>
  );
}

export default App;