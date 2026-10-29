import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import api from "../api/client";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalODS: 0,
    pendingODS: 0,
    approvedODS: 0,
    completedODS: 0,
    rejectedODS: 0,
  });
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications"); // "applications", "mentors", "students"
  const [filterMentor, setFilterMentor] = useState("ALL");

  const fetchAdminData = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      if (res.data?.success) {
        setStats(res.data.stats || {});
        setApplications(res.data.applications || []);
        setStudents(res.data.students || []);
        setFaculties(res.data.faculties || []);
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 12000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { icon: "👨‍🎓", title: "Total Students", value: stats.totalStudents },
    { icon: "👨‍🏫", title: "Faculty Mentors", value: stats.totalFaculty },
    { icon: "📄", title: "Total Applications", value: stats.totalODS },
    { icon: "⏳", title: "Pending Review", value: stats.pendingODS },
    { icon: "✅", title: "Approved ODS", value: stats.approvedODS },
    { icon: "🏆", title: "Completed & Verified", value: stats.completedODS },
  ];

  const filteredApps = applications.filter((app) => {
    if (filterMentor === "ALL") return true;
    return (
      app.mentor === filterMentor ||
      (app.mentorName && app.mentorName.toLowerCase().includes(filterMentor.toLowerCase()))
    );
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="main-content">
        <Navbar title="Administrator Control Center" />

        <section className="dashboard-content">
          <div className="welcome-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>College Admin Dashboard 🏛️</h1>
              <p>Real-time campus-wide monitoring of On-Duty Sanctions, Mentors, and Verified Event Proofs.</p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setActiveTab("applications")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: activeTab === "applications" ? "var(--color-brand-600)" : "var(--bg-surface)",
                  color: activeTab === "applications" ? "#fff" : "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📄 All Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("mentors")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: activeTab === "mentors" ? "var(--color-brand-600)" : "var(--bg-surface)",
                  color: activeTab === "mentors" ? "#fff" : "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                👨‍🏫 Mentors ({faculties.length})
              </button>
              <button
                onClick={() => setActiveTab("students")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: activeTab === "students" ? "var(--color-brand-600)" : "var(--bg-surface)",
                  color: activeTab === "students" ? "#fff" : "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                👨‍🎓 Students ({students.length})
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stats-grid">
            {statCards.map((s) => (
              <div className="stat-card" key={s.title}>
                <div className="stat-icon">{s.icon}</div>
                <div>
                  <p>{s.title}</p>
                  <h2>{loading ? "-" : s.value}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Tab 1: All Applications */}
          {activeTab === "applications" && (
            <div className="dashboard-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "16px" }}>Campus ODS Records</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Filter by Mentor:</span>
                  <select
                    value={filterMentor}
                    onChange={(e) => setFilterMentor(e.target.value)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "13px",
                      background: "var(--bg-app)",
                    }}
                  >
                    <option value="ALL">All Mentors</option>
                    <option value="FAC_MANISH">Dr. Manish Bhardwaj</option>
                    <option value="FAC_SUMIT">Prof. Sumit Kumar</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <p>Loading ODS records...</p>
              ) : filteredApps.length === 0 ? (
                <p style={{ color: "var(--text-muted)", padding: "16px 0" }}>No applications match the current filter.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-subtle)", textAlign: "left", background: "var(--bg-app)" }}>
                      <th style={{ padding: "10px" }}>Student</th>
                      <th style={{ padding: "10px" }}>Event</th>
                      <th style={{ padding: "10px" }}>Duration</th>
                      <th style={{ padding: "10px" }}>Assigned Mentor</th>
                      <th style={{ padding: "10px" }}>Proof & Report</th>
                      <th style={{ padding: "10px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app) => (
                      <tr key={app._id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "12px 10px" }}>
                          <strong>{app.student?.fullName || "Student"}</strong>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {app.student?.enrollmentNumber} • {app.student?.department}
                          </div>
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <strong>{app.eventName}</strong>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{app.eventType}</div>
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          {app.startDate} to {app.endDate}
                        </td>
                        <td style={{ padding: "12px 10px", fontWeight: 600, color: "var(--color-brand-600)" }}>
                          {app.mentorName || app.mentor}
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background:
                                app.eventReport?.status === "VERIFIED"
                                  ? "#dcfce7"
                                  : app.eventReport?.status === "SUBMITTED"
                                  ? "#e0f2fe"
                                  : "#fef3c7",
                              color:
                                app.eventReport?.status === "VERIFIED"
                                  ? "#15803d"
                                  : app.eventReport?.status === "SUBMITTED"
                                  ? "#0369a1"
                                  : "#b45309",
                            }}
                          >
                            {app.eventReport?.status === "VERIFIED"
                              ? "Verified ✅"
                              : app.eventReport?.status === "SUBMITTED"
                              ? "Submitted 📄"
                              : "Pending ⏳"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <span
                            className={`status ${
                              app.status === "COMPLETED" || app.status === "APPROVED"
                                ? "approved"
                                : app.status === "REJECTED"
                                ? "rejected"
                                : "pending"
                            }`}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Tab 2: Mentors */}
          {activeTab === "mentors" && (
            <div className="dashboard-card" style={{ padding: "20px" }}>
              <h2 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Registered Faculty Mentors</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-subtle)", textAlign: "left", background: "var(--bg-app)" }}>
                    <th style={{ padding: "10px" }}>Faculty Name</th>
                    <th style={{ padding: "10px" }}>Faculty ID</th>
                    <th style={{ padding: "10px" }}>Department</th>
                    <th style={{ padding: "10px" }}>Designation</th>
                    <th style={{ padding: "10px" }}>Official Email</th>
                  </tr>
                </thead>
                <tbody>
                  {faculties.map((f) => (
                    <tr key={f._id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "12px 10px", fontWeight: 700 }}>{f.fullName}</td>
                      <td style={{ padding: "12px 10px", color: "var(--color-brand-600)", fontWeight: 600 }}>{f.facultyId}</td>
                      <td style={{ padding: "12px 10px" }}>{f.department}</td>
                      <td style={{ padding: "12px 10px" }}>{f.designation}</td>
                      <td style={{ padding: "12px 10px" }}>{f.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Students */}
          {activeTab === "students" && (
            <div className="dashboard-card" style={{ padding: "20px" }}>
              <h2 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Registered Students</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-subtle)", textAlign: "left", background: "var(--bg-app)" }}>
                    <th style={{ padding: "10px" }}>Student Name</th>
                    <th style={{ padding: "10px" }}>Enrollment No</th>
                    <th style={{ padding: "10px" }}>Email</th>
                    <th style={{ padding: "10px" }}>Department</th>
                    <th style={{ padding: "10px" }}>Year / Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "12px 10px", fontWeight: 700 }}>{s.fullName}</td>
                      <td style={{ padding: "12px 10px", color: "var(--color-brand-600)", fontWeight: 600 }}>{s.enrollmentNumber}</td>
                      <td style={{ padding: "12px 10px" }}>{s.email}</td>
                      <td style={{ padding: "12px 10px" }}>{s.department} ({s.course})</td>
                      <td style={{ padding: "12px 10px" }}>Year {s.year} / Sem {s.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;