import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import api from "../api/client";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    mobileNumber: "",
    personalEmail: "",
    designation: "",
    department: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      if (res.data?.success) {
        setProfile(res.data.profile);
        setStats(res.data.stats || {});
        setForm({
          mobileNumber: res.data.profile.mobileNumber || "",
          personalEmail: res.data.profile.personalEmail || "",
          designation: res.data.profile.designation || "",
          department: res.data.profile.department || "",
        });
      }
    } catch (err) {
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setError("");
      const res = await api.put("/users/profile", form);
      if (res.data?.success) {
        setMessage("Profile updated successfully!");
        // Update stored user
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...form }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const role = profile?.role || "student";

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />

      <main className="main-content">
        <Navbar title="My Profile" />

        <section className="dashboard-content">
          <div className="welcome-section">
            <div>
              <h1>User Profile & Settings 👤</h1>
              <p>Manage your account credentials, contact information, and view ODS participation stats.</p>
            </div>
          </div>

          {message && (
            <div
              style={{
                padding: "12px 18px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: "#dcfce7",
                color: "#15803d",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "12px 18px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
              {/* Left Profile Card */}
              <div className="dashboard-card" style={{ padding: "28px", textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-brand-600)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: 700,
                    margin: "0 auto 16px",
                  }}
                >
                  {profile.fullName?.substring(0, 2).toUpperCase() || "U"}
                </div>

                <h2 style={{ margin: "0 0 4px 0", fontSize: "18px" }}>{profile.fullName}</h2>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 12px",
                    borderRadius: "12px",
                    backgroundColor: "var(--color-brand-50)",
                    color: "var(--color-brand-600)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  {role}
                </span>

                <div style={{ textAlign: "left", fontSize: "13px", lineHeight: "1.8", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
                  <p style={{ margin: "4px 0" }}><strong>Official Email:</strong> {profile.email}</p>
                  {profile.enrollmentNumber && (
                    <p style={{ margin: "4px 0" }}><strong>Enrollment No:</strong> {profile.enrollmentNumber}</p>
                  )}
                  {profile.facultyId && (
                    <p style={{ margin: "4px 0" }}><strong>Faculty ID:</strong> {profile.facultyId}</p>
                  )}
                  <p style={{ margin: "4px 0" }}><strong>Department:</strong> {profile.department}</p>
                  {profile.course && <p style={{ margin: "4px 0" }}><strong>Course:</strong> {profile.course}</p>}
                </div>

                {/* Stats */}
                <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border-subtle)" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", color: "var(--text-muted)" }}>ACTIVITY METRICS</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div style={{ background: "var(--bg-app)", padding: "10px", borderRadius: "8px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                        {role === "faculty" ? "Mentored" : "Applied"}
                      </span>
                      <strong style={{ fontSize: "18px", color: "var(--color-brand-600)" }}>
                        {role === "faculty" ? stats.totalMentored || 0 : stats.totalApplied || 0}
                      </strong>
                    </div>
                    <div style={{ background: "var(--bg-app)", padding: "10px", borderRadius: "8px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                        {role === "faculty" ? "Verified" : "Completed"}
                      </span>
                      <strong style={{ fontSize: "18px", color: "var(--color-success)" }}>
                        {role === "faculty" ? stats.verifiedProofs || 0 : stats.completed || 0}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Card */}
              <div className="dashboard-card" style={{ padding: "28px" }}>
                <h3 style={{ margin: "0 0 18px 0", fontSize: "16px" }}>Contact & Department Information</h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                      Mobile Contact Number *
                    </label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={form.mobileNumber}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-app)",
                      }}
                    />
                  </div>

                  {role === "student" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                        Personal Alternative Email
                      </label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={form.personalEmail}
                        onChange={handleChange}
                        placeholder="personal.email@gmail.com"
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-subtle)",
                          backgroundColor: "var(--bg-app)",
                        }}
                      />
                    </div>
                  )}

                  {role === "faculty" && (
                    <>
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Designation
                        </label>
                        <input
                          type="text"
                          name="designation"
                          value={form.designation}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--bg-app)",
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={form.department}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--bg-app)",
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div style={{ marginTop: "24px" }}>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        padding: "10px 22px",
                        backgroundColor: "var(--color-brand-600)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {saving ? "Saving Changes..." : "Save Profile Details"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default Profile;
