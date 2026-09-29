import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    email: "",
    mobile: "",
    department: "",
    course: "",
    year: "",
    semester: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Registration successful. OTP verification will be added later.");

    navigate("/login");
  };

  return (
    <div className="auth-page">

      <div className="register-card">

        <div className="logo-box">
          ODS
        </div>

        <h1>Create Account</h1>

        <p className="subtitle">
          College On-Duty Management System
        </p>

        <div className="role-buttons">

          <button
            type="button"
            className={role === "student" ? "active-role" : ""}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "faculty" ? "active-role" : ""}
            onClick={() => setRole("faculty")}
          >
            Faculty
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div>
              <label>Full Name</label>
              <input
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {role === "student" && (
              <div>
                <label>Enrollment Number</label>
                <input
                  name="enrollment"
                  placeholder="Enter enrollment number"
                  value={formData.enrollment}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label>College Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Mobile Number</label>
              <input
                name="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Department</label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">
                  Computer Science
                </option>
                <option value="ECE">
                  Electronics
                </option>
                <option value="ME">
                  Mechanical
                </option>
                <option value="CE">
                  Civil
                </option>
              </select>

            </div>

            {role === "student" && (
              <>
                <div>
                  <label>Course</label>

                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>

                </div>

                <div>
                  <label>Year</label>

                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>

                </div>

                <div>
                  <label>Semester</label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>

                </div>
              </>
            )}

            <div>
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <div>
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <button className="primary-btn">
            Create Account
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;