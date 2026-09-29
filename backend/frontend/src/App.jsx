import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterFaculty from "./pages/RegisterFaculty";
import VerifyOtp from "./pages/VerifyOtp";

import StudentDashboard from "./pages/studentDashboard";
import ApplyODS from "./pages/applyODS";
import FacultyDashboard from "./pages/facultyDashboard";
import AdminDashboard from "./pages/adminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        
        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register/student"
          element={<RegisterStudent />}
        />

        <Route
          path="/register/faculty"
          element={<RegisterFaculty />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

<Route
  path="/student"
  element={<StudentDashboard />}
/>

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
          path="/faculty"
          element={<FacultyDashboard />}
        />


        {/* Admin */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}