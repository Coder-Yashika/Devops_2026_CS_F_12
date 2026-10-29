import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import api from "../api/client";

const rejectionReasons = [
  "Incomplete information provided",
  "Event dates clash with examinations/internals",
  "Insufficient attendance percentage",
  "Invalid or missing proof document",
  "Not eligible for academic ODS",
  "Other",
];

function FacultyDashboard() {
  const location = useLocation();

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    proofPending: 0,
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Determine initial tab from route
  const getTabFromPath = (path) => {
    if (path.includes("/requests")) return "pending";
    if (path.includes("/approved")) return "approved";
    if (path.includes("/rejected")) return "rejected";
    if (path.includes("/proof")) return "proofs";
    if (path.includes("/students")) return "students";
    if (path.includes("/history")) return "history";
    return "pending";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Reject modal state
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [allowResubmit, setAllowResubmit] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Proof Review Modal State
  const [viewingReportApp, setViewingReportApp] = useState(null);
  const [mentorFeedback, setMentorFeedback] = useState("");

  // Student Profile Modal State
  const [viewingStudent, setViewingStudent] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/faculty/dashboard");
      if (response.data?.success) {
        setStats(
          response.data.stats || {
            pending: 0,
            approved: 0,
            rejected: 0,
            proofPending: 0,
          }
        );
        setApplications(response.data.applications || []);
        setError("");
      }
    } catch (err) {
      console.error("Faculty dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load faculty dashboard. Please ensure you are logged in with faculty credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await api.put(`/faculty/ods/${id}/decision`, { decision: "APPROVED" });
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve application.");
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setReason("");
    setRemarks("");
    setAllowResubmit(false);
  };

  const closeRejectModal = () => {
    setRejectingId(null);
  };

  const confirmReject = async () => {
    if (!reason || !rejectingId) return;
    try {
      setActionLoading(true);
      await api.put(`/faculty/ods/${rejectingId}/decision`, {
        decision: "REJECTED",
        remarks: `${reason}. ${remarks}`.trim(),
      });
      closeRejectModal();
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject application.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyProof = async (decision) => {
    if (!viewingReportApp) return;
    try {
      setActionLoading(true);
      await api.put(`/faculty/ods/${viewingReportApp._id}/verify-proof`, {
        decision,
        facultyRemarks: mentorFeedback || (decision === "VERIFIED" ? "Verified and confirmed." : "Please revise."),
      });
      setViewingReportApp(null);
      setMentorFeedback("");
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process proof verification.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter applications by search query
  const filteredApps = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const studentName = app.student?.fullName?.toLowerCase() || "";
    const roll = app.student?.enrollmentNumber?.toLowerCase() || "";
    const event = app.eventName?.toLowerCase() || "";
    return studentName.includes(q) || roll.includes(q) || event.includes(q);
  });

  const pendingApps = filteredApps.filter((app) => app.mentorStatus === "PENDING");
  const approvedApps = filteredApps.filter(
    (app) => app.mentorStatus === "APPROVED" || app.status === "COMPLETED" || app.status === "PROOF_PENDING"
  );
  const rejectedApps = filteredApps.filter((app) => app.mentorStatus === "REJECTED");
  const proofApps = filteredApps.filter(
    (app) =>
      app.status === "PROOF_SUBMITTED" ||
      app.status === "PROOF_PENDING" ||
      app.eventReport?.status === "SUBMITTED" ||
      app.eventReport?.status === "VERIFIED"
  );
  const historyApps = filteredApps.filter((app) => app.mentorStatus !== "PENDING");

  // Unique students mentored
  const uniqueStudentsMap = {};
  applications.forEach((a) => {
    if (a.student && a.student._id && !uniqueStudentsMap[a.student._id]) {
      uniqueStudentsMap[a.student._id] = {
        ...a.student,
        totalODS: applications.filter((x) => x.student?._id === a.student._id).length,
      };
    }
  });
  const uniqueStudents = Object.values(uniqueStudentsMap);

  return (
    <div className="dashboard-layout">
      <Sidebar role="faculty" />

      <main className="main-content">
        <Navbar title="Faculty Mentorship Portal" />

        <section className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <h1>Welcome, Mentor 👋</h1>
              <p>Review and verify ODS applications, inspect submitted student event reports, and monitor students.</p>
            </div>

            <button
              onClick={fetchDashboard}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--color-brand-600)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              🔄 Refresh Data
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* ========================= INTERACTIVE STAT CARDS ========================= */}
          <div className="stats-grid">
            <div
              className={`stat-card ${activeTab === "pending" ? "active-stat-card" : ""}`}
              onClick={() => setActiveTab("pending")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon">⏳</div>
              <div>
                <p>Pending Requests</p>
                <h2>{stats.pending}</h2>
              </div>
            </div>

            <div
              className={`stat-card ${activeTab === "approved" ? "active-stat-card" : ""}`}
              onClick={() => setActiveTab("approved")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon">✅</div>
              <div>
                <p>Approved ODS</p>
                <h2>{stats.approved}</h2>
              </div>
            </div>

            <div
              className={`stat-card ${activeTab === "proofs" ? "active-stat-card" : ""}`}
              onClick={() => setActiveTab("proofs")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon">📄</div>
              <div>
                <p>Event Reports / Proofs</p>
                <h2>{proofApps.length}</h2>
              </div>
            </div>

            <div
              className={`stat-card ${activeTab === "students" ? "active-stat-card" : ""}`}
              onClick={() => setActiveTab("students")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon">👨‍🎓</div>
              <div>
                <p>Mentored Students</p>
                <h2>{uniqueStudents.length}</h2>
              </div>
            </div>
          </div>

          {/* ========================= TAB NAVIGATION & SEARCH BAR ========================= */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { id: "pending", label: `⏳ Pending (${pendingApps.length})` },
                { id: "approved", label: `✅ Approved (${approvedApps.length})` },
                { id: "rejected", label: `❌ Rejected (${rejectedApps.length})` },
                { id: "proofs", label: `📄 Event Reports (${proofApps.length})` },
                { id: "students", label: `👨‍🎓 My Students (${uniqueStudents.length})` },
                { id: "history", label: "📜 History" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: activeTab === tab.id ? "var(--color-brand-600)" : "var(--bg-surface)",
                    color: activeTab === tab.id ? "#fff" : "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="🔍 Search student, roll no, event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                fontSize: "13px",
                width: "260px",
                backgroundColor: "var(--bg-surface)",
              }}
            />
          </div>

          {/* ========================= TAB 1: PENDING REQUESTS ========================= */}
          {activeTab === "pending" && (
            <div className="dashboard-card" style={{ marginBottom: "24px" }}>
              <div className="card-header">
                <h2>Pending ODS Requests for Review ({pendingApps.length})</h2>
              </div>

              {loading ? (
                <p style={{ padding: "20px", color: "var(--text-muted)" }}>Loading applications...</p>
              ) : pendingApps.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: "16px", margin: 0 }}>🎉 All caught up!</p>
                  <p style={{ fontSize: "13px", marginTop: "4px" }}>No student applications are currently awaiting your decision.</p>
                </div>
              ) : (
                pendingApps.map((app) => (
                  <div
                    className="application-row"
                    key={app._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <strong
                        onClick={() => setViewingStudent(app.student)}
                        style={{ color: "var(--color-brand-600)", cursor: "pointer", textDecoration: "underline" }}
                        title="Click to view student profile"
                      >
                        {app.student?.fullName || "Student"}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>
                        ({app.student?.enrollmentNumber || "N/A"} • {app.student?.department || "CSE"})
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text-primary)" }}>
                        <strong>{app.eventName}</strong> ({app.eventType})
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                        📅 {app.startDate} to {app.endDate} • ⏰ {app.startTime} - {app.endTime} • 📍 {app.location}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#475569" }}>
                        <em>Purpose:</em> {app.purpose}
                      </p>
                      {app.eventLink && (
                        <p style={{ margin: "2px 0 0", fontSize: "12px" }}>
                          🔗 <a href={app.eventLink} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>Event Website</a>
                        </p>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        onClick={() => handleApprove(app._id)}
                        disabled={actionLoading}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "var(--color-success, #2f7d5c)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        Approve ODS
                      </button>
                      <button
                        onClick={() => openRejectModal(app._id)}
                        disabled={actionLoading}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "var(--color-danger, #b3432f)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ========================= TAB 2: APPROVED ODS ========================= */}
          {activeTab === "approved" && (
            <div className="dashboard-card" style={{ marginBottom: "24px" }}>
              <div className="card-header">
                <h2>Approved ODS Applications ({approvedApps.length})</h2>
              </div>

              {approvedApps.length === 0 ? (
                <p style={{ padding: "20px", color: "var(--text-muted)" }}>No approved applications found.</p>
              ) : (
                approvedApps.map((app) => (
                  <div
                    className="application-row"
                    key={app._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <strong
                        onClick={() => setViewingStudent(app.student)}
                        style={{ color: "var(--color-brand-600)", cursor: "pointer" }}
                      >
                        {app.student?.fullName || "Student"}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>
                        ({app.student?.enrollmentNumber})
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
                        <strong>{app.eventName}</strong> ({app.eventType})
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                        {app.startDate} to {app.endDate} • {app.location}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor: "rgba(47, 125, 92, 0.1)",
                          color: "var(--color-success)",
                        }}
                      >
                        {app.status === "COMPLETED" ? "COMPLETED ✅" : "APPROVED"}
                      </span>

                      {app.eventReport?.status === "SUBMITTED" && (
                        <button
                          onClick={() => {
                            setViewingReportApp(app);
                            setMentorFeedback(app.eventReport?.facultyRemarks || "");
                          }}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "var(--color-brand-600)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Review Report
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ========================= TAB 3: REJECTED ODS ========================= */}
          {activeTab === "rejected" && (
            <div className="dashboard-card" style={{ marginBottom: "24px" }}>
              <div className="card-header">
                <h2>Rejected Applications ({rejectedApps.length})</h2>
              </div>

              {rejectedApps.length === 0 ? (
                <p style={{ padding: "20px", color: "var(--text-muted)" }}>No rejected applications.</p>
              ) : (
                rejectedApps.map((app) => (
                  <div
                    className="application-row"
                    key={app._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <strong>{app.student?.fullName || "Student"}</strong>
                      <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
                        <strong>{app.eventName}</strong> ({app.eventType})
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>
                        <em>Remarks:</em> {app.mentorRemarks || "Rejected"}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: "rgba(179, 67, 47, 0.1)",
                        color: "var(--color-danger)",
                      }}
                    >
                      REJECTED
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ========================= TAB 4: EVENT REPORTS & PROOFS ========================= */}
          {activeTab === "proofs" && (
            <div className="dashboard-card" style={{ marginBottom: "24px" }}>
              <div className="card-header">
                <h2>Student Post-Event Reports & Proof Verification ({proofApps.length})</h2>
              </div>

              {proofApps.length === 0 ? (
                <p style={{ padding: "20px", color: "var(--text-muted)" }}>
                  No student has submitted an event report yet.
                </p>
              ) : (
                proofApps.map((app) => (
                  <div
                    className="application-row"
                    key={app._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <strong
                        onClick={() => setViewingStudent(app.student)}
                        style={{ color: "var(--color-brand-600)", cursor: "pointer" }}
                      >
                        {app.student?.fullName || "Student"}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>
                        ({app.student?.enrollmentNumber})
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
                        <strong>{app.eventName}</strong> • Report Status:{" "}
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              app.eventReport?.status === "VERIFIED"
                                ? "var(--color-success)"
                                : app.eventReport?.status === "SUBMITTED"
                                ? "#0284c7"
                                : "#d97706",
                          }}
                        >
                          {app.eventReport?.status === "SUBMITTED"
                            ? "SUBMITTED FOR REVIEW ⏳"
                            : app.eventReport?.status === "VERIFIED"
                            ? "VERIFIED & ATTENDANCE GRANTED ✅"
                            : "PENDING SUBMISSION"}
                        </span>
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                        Certificate Document: {app.eventReport?.certificateUrl ? "Attached 🔗" : "Pending"}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          setViewingReportApp(app);
                          setMentorFeedback(app.eventReport?.facultyRemarks || "");
                        }}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "var(--color-brand-600)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        📄 Review & Verify Report
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ========================= TAB 5: MY STUDENTS ========================= */}
          {activeTab === "students" && (
            <div className="dashboard-card" style={{ padding: "20px" }}>
              <div className="card-header">
                <h2>Mentored Students Roster ({uniqueStudents.length})</h2>
              </div>

              {uniqueStudents.length === 0 ? (
                <p style={{ padding: "20px", color: "var(--text-muted)" }}>No students currently assigned.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-subtle)", textAlign: "left", background: "var(--bg-app)" }}>
                      <th style={{ padding: "10px" }}>Student Name</th>
                      <th style={{ padding: "10px" }}>Enrollment No</th>
                      <th style={{ padding: "10px" }}>Department / Year</th>
                      <th style={{ padding: "10px" }}>Contact</th>
                      <th style={{ padding: "10px" }}>Total ODS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueStudents.map((s) => (
                      <tr key={s._id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "12px 10px", fontWeight: 700 }}>
                          <span
                            onClick={() => setViewingStudent(s)}
                            style={{ color: "var(--color-brand-600)", cursor: "pointer", textDecoration: "underline" }}
                          >
                            {s.fullName}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", color: "var(--color-brand-600)", fontWeight: 600 }}>{s.enrollmentNumber}</td>
                        <td style={{ padding: "12px 10px" }}>{s.department} (Year {s.year || "3"})</td>
                        <td style={{ padding: "12px 10px" }}>{s.mobileNumber || s.email}</td>
                        <td style={{ padding: "12px 10px", fontWeight: 700 }}>{s.totalODS}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ========================= TAB 6: HISTORY ========================= */}
          {activeTab === "history" && (
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Complete Mentorship History ({historyApps.length})</h2>
              </div>

              {historyApps.length === 0 ? (
                <p style={{ padding: "20px", color: "var(--text-muted)" }}>No past history.</p>
              ) : (
                historyApps.map((app) => (
                  <div
                    className="application-row"
                    key={app._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 20px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <strong>{app.student?.fullName || "Student"}</strong>
                      <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
                        <strong>{app.eventName}</strong> ({app.eventType})
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                        {app.startDate} to {app.endDate}
                      </p>
                    </div>

                    <span
                      className={`status ${app.mentorStatus === "APPROVED" ? "approved" : "rejected"}`}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor:
                          app.mentorStatus === "APPROVED" ? "rgba(47, 125, 92, 0.1)" : "rgba(179, 67, 47, 0.1)",
                        color: app.mentorStatus === "APPROVED" ? "var(--color-success)" : "var(--color-danger)",
                      }}
                    >
                      {app.status === "COMPLETED" ? "COMPLETED ✅" : app.mentorStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>

      {/* ================= MODAL 1: REJECT ODS ================= */}
      {rejectingId !== null && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Reject ODS Application</h3>

            <label>Reason *</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select a reason</option>
              {rejectionReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <label>Detailed Remarks / Note for Student</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add instructions or explain why this request is not approved..."
            />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={allowResubmit}
                onChange={(e) => setAllowResubmit(e.target.checked)}
              />
              Allow student to resubmit with corrected details
            </label>

            <div className="modal-actions">
              <button onClick={closeRejectModal}>Cancel</button>
              <button className="btn-reject" disabled={!reason || actionLoading} onClick={confirmReject}>
                {actionLoading ? "Processing..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: REVIEW EVENT REPORT ================= */}
      {viewingReportApp !== null && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "750px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
              Official Student Event Report Verification
            </h3>

            <div style={{ margin: "14px 0", fontSize: "13px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <p style={{ margin: 0 }}><strong>Student:</strong> {viewingReportApp.student?.fullName} ({viewingReportApp.student?.enrollmentNumber})</p>
              <p style={{ margin: 0 }}><strong>Event:</strong> {viewingReportApp.eventName} ({viewingReportApp.eventType})</p>
              <p style={{ margin: 0 }}><strong>Duration:</strong> {viewingReportApp.startDate} to {viewingReportApp.endDate}</p>
              <p style={{ margin: 0 }}><strong>Role:</strong> {viewingReportApp.eventReport?.participationRole || "Participant"}</p>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px", marginBottom: "14px" }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#1e293b" }}>1. Executive Summary & Activities:</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                {viewingReportApp.eventReport?.executiveSummary || "No summary provided."}
              </p>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px", marginBottom: "14px" }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#1e293b" }}>2. Key Learnings & Skills Acquired:</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                {viewingReportApp.eventReport?.keyLearnings || "No learnings provided."}
              </p>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px", marginBottom: "14px" }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#1e293b" }}>3. Project Outcome & Awards:</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                {viewingReportApp.eventReport?.projectOutcome || "No outcome provided."}
              </p>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px", marginBottom: "18px" }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#1e293b" }}>4. Submitted Certificate & Documents:</h4>
              {viewingReportApp.eventReport?.certificateUrl ? (
                <p style={{ margin: "4px 0" }}>
                  <a
                    href={viewingReportApp.eventReport.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", textDecoration: "underline", fontSize: "13px", wordBreak: "break-all", fontWeight: 600 }}
                  >
                    🔗 View Certificate / Proof Document
                  </a>
                </p>
              ) : (
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>No certificate link provided.</span>
              )}

              {viewingReportApp.eventReport?.photosUrl && (
                <p style={{ margin: "6px 0 0" }}>
                  <a
                    href={viewingReportApp.eventReport.photosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", textDecoration: "underline", fontSize: "13px", wordBreak: "break-all" }}
                  >
                    📸 View Photographs / Album
                  </a>
                </p>
              )}
            </div>

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Mentor Feedback / Attendance Remarks:
            </label>
            <textarea
              rows={2}
              value={mentorFeedback}
              onChange={(e) => setMentorFeedback(e.target.value)}
              placeholder="e.g. Verified certificate and event participation. Attendance sanctioned."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                marginBottom: "16px",
              }}
            />

            <div className="modal-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setViewingReportApp(null)}>Cancel</button>
              <button
                onClick={() => handleVerifyProof("CHANGES_REQUESTED")}
                disabled={actionLoading}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#d97706",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Request Revision
              </button>
              <button
                onClick={() => handleVerifyProof("VERIFIED")}
                disabled={actionLoading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--color-success)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Verify Proof & Sanction Attendance ✅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: STUDENT PROFILE ================= */}
      {viewingStudent !== null && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "480px", width: "90%" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px", margin: "0 0 16px 0" }}>
              Student Profile Card
            </h3>

            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-brand-600)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  margin: "0 auto 10px",
                }}
              >
                {viewingStudent.fullName?.substring(0, 2).toUpperCase() || "S"}
              </div>
              <h4 style={{ margin: 0, fontSize: "16px" }}>{viewingStudent.fullName}</h4>
              <p style={{ margin: "2px 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
                {viewingStudent.enrollmentNumber}
              </p>
            </div>

            <div style={{ fontSize: "13px", lineHeight: "1.8", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
              <p style={{ margin: "4px 0" }}><strong>Department:</strong> {viewingStudent.department}</p>
              <p style={{ margin: "4px 0" }}><strong>Course:</strong> {viewingStudent.course || "B.Tech"}</p>
              <p style={{ margin: "4px 0" }}><strong>Year / Semester:</strong> Year {viewingStudent.year || "3"} / Sem {viewingStudent.semester || "5"}</p>
              <p style={{ margin: "4px 0" }}><strong>College Email:</strong> {viewingStudent.email}</p>
              <p style={{ margin: "4px 0" }}><strong>Mobile Number:</strong> {viewingStudent.mobileNumber || "N/A"}</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                onClick={() => setViewingStudent(null)}
                style={{
                  padding: "8px 18px",
                  backgroundColor: "var(--color-brand-600)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyDashboard;