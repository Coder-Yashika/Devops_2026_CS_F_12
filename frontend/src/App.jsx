import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterFaculty from "./pages/RegisterFaculty";
import VerifyOtp from "./pages/VerifyOtp";

import StudentDashboard from "./pages/studentDashboard";
import ApplyODS from "./pages/applyODS";
import ProofSubmission from "./pages/ProofSubmission";
import FacultyDashboard from "./pages/facultyDashboard";
import AdminDashboard from "./pages/adminDashboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/faculty" element={<RegisterFaculty />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/apply-ods" element={<ApplyODS />} />
        <Route path="/student/proof" element={<ProofSubmission />} />
        <Route path="/student/applications" element={<StudentDashboard />} />
        <Route path="/student/approved" element={<StudentDashboard />} />
        <Route path="/student/notifications" element={<ProofSubmission />} />
        <Route path="/student/profile" element={<Profile />} />

        {/* Faculty Routes */}
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/requests" element={<FacultyDashboard />} />
        <Route path="/faculty/approved" element={<FacultyDashboard />} />
        <Route path="/faculty/rejected" element={<FacultyDashboard />} />
        <Route path="/faculty/proof" element={<FacultyDashboard />} />
        <Route path="/faculty/students" element={<FacultyDashboard />} />
        <Route path="/faculty/history" element={<FacultyDashboard />} />
        <Route path="/faculty/notifications" element={<FacultyDashboard />} />
        <Route path="/faculty/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}