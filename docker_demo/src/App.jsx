import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./App.css";

// Get registered users from localStorage
function getUsers() {
  try {
    const users = JSON.parse(
      localStorage.getItem("authDemoUsers") || "[]"
    );

    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

// Registration Component
function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  // Handle registration
  function handleRegister(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const mobile = form.mobile.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // Name validation
    if (name.length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    // Indian mobile number validation
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check existing users
    const users = getUsers();

    const userExists = users.some(
      (user) =>
        user.email?.toLowerCase() === email ||
        user.mobile === mobile
    );

    if (userExists) {
      setError("Email or mobile number is already registered.");
      return;
    }

    // Save user (demo only)
    const newUser = {
      name,
      mobile,
      email,
      password,
    };

    try {
      localStorage.setItem(
        "authDemoUsers",
        JSON.stringify([...users, newUser])
      );

      localStorage.setItem(
        "authDemoCurrentUser",
        JSON.stringify({
          name,
          mobile,
          email,
        })
      );

      navigate("/welcome");
    } catch {
      setError("Unable to save registration. Please try again.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✦</div>
          <h1>Create Account</h1>
          <p>Join us today. It only takes a minute!</p>
        </div>

        <form onSubmit={handleRegister}>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              name="mobile"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={handleChange}
              maxLength={10}
              autoComplete="tel"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <small>
              At least 8 characters, including a letter and a number.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="register-button">
            Create Account →
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

// Welcome Page
function Welcome() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("authDemoCurrentUser") || "{}"
    );
  } catch {
    user = {};
  }

  return (
    <div className="auth-page">
      <div className="auth-card welcome-card">
        <div className="success-icon">✓</div>

        <h1>Welcome, {user.name || "User"}!</h1>

        <p>
          Your account has been created successfully.
        </p>

        <button
          className="register-button"
          onClick={() => navigate("/")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

// Simple Login Page
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    const users = getUsers();

    const user = users.find(
      (u) =>
        u.email?.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem(
      "authDemoCurrentUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      })
    );

    navigate("/welcome");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✦</div>
          <h1>Welcome Back!</h1>
          <p>Login to continue to your account.</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="register-button">
            Login →
          </button>
        </form>

        <p className="login-text">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
}