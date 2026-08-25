import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend navigation.
    // Later this will call the backend login API.

    if (role === "student") {
      navigate("/student/dashboard");
    } else if (role === "faculty") {
      navigate("/faculty/dashboard");
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="logo-box">
          ODS
        </div>

        <h1>College ODS</h1>

        <p className="subtitle">
          On-Duty Management System
        </p>

        <form onSubmit={handleSubmit}>

          <label>Login As</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <label>College Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your college email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="primary-btn">
            Login
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;