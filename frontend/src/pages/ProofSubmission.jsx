import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import api from "../api/client";

function ProofSubmission() {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [viewMode, setViewMode] = useState("edit"); // "edit" or "preview"

  // Report fields
  const [report, setReport] = useState({
    executiveSummary: "",
    participationRole: "Individual Participant",
    keyLearnings: "",
    projectOutcome: "",
    certificateUrl: "",
    photosUrl: "",
    additionalNotes: "",
  });

  const loadReportFromApp = (app) => {
    if (!app) return;
    const existing = app.eventReport || {};
    setReport({
      executiveSummary:
        existing.executiveSummary ||
        `Participated actively in "${app.eventName}" organized by ${app.organizer} held from ${app.startDate} to ${app.endDate} at ${app.location}. Attended all technical sessions and hands-on tracks.`,
      participationRole: existing.participationRole || "Individual Participant",
      keyLearnings:
        existing.keyLearnings ||
        "Gained hands-on technical understanding, domain problem-solving practices, and collaborative interaction with industry peers and speakers.",
      projectOutcome:
        existing.projectOutcome ||
        `Successfully delivered task milestones for the ${app.eventType} track and received certificate of participation.`,
      certificateUrl: existing.certificateUrl || "",
      photosUrl: existing.photosUrl || "",
      additionalNotes: existing.additionalNotes || "",
    });
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get("/ods/my-applications");
      if (res.data?.success) {
        const apps = res.data.applications || [];
        setApplications(apps);

        if (apps.length > 0) {
          const defaultApp = apps.find(
            (a) => a.status === "PROOF_PENDING" || a.status === "PROOF_SUBMITTED" || a.status === "APPROVED"
          ) || apps[0];

          setSelectedAppId(defaultApp._id);
          setSelectedApp(defaultApp);
          loadReportFromApp(defaultApp);
        }
      }
    } catch {
      setErrorMsg("Failed to load your ODS applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAppChange = (e) => {
    const id = e.target.value;
    setSelectedAppId(id);
    const chosen = applications.find((a) => a._id === id);
    setSelectedApp(chosen);
    loadReportFromApp(chosen);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleChange = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppId) {
      setErrorMsg("Please select an ODS application.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await api.post(`/ods/${selectedAppId}/report`, report);
      if (res.data?.success) {
        setSuccessMsg("Official Event Report and Proof submitted successfully! Sent to mentor for review.");
        await fetchApplications();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit event report.");
    } finally {
      setSubmitting(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" />

      <main className="main-content">
        <Navbar title="Event Proof & Report" />

        <section className="dashboard-content">
          <div className="welcome-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>Official Event Report & Proof 📄</h1>
              <p>Fill or edit your standard event report template to verify your ODS attendance.</p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: viewMode === "edit" ? "var(--color-brand-600)" : "var(--bg-surface)",
                  color: viewMode === "edit" ? "#fff" : "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✏️ Edit Format
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: viewMode === "preview" ? "var(--color-brand-600)" : "var(--bg-surface)",
                  color: viewMode === "preview" ? "#fff" : "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📄 Formal Document Preview
              </button>
            </div>
          </div>

          {successMsg && (
            <div
              style={{
                padding: "14px 18px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: "#dcfce7",
                color: "#15803d",
                fontSize: "14px",
                fontWeight: 500,
                border: "1px solid #bbf7d0",
              }}
            >
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                padding: "14px 18px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                fontSize: "14px",
                fontWeight: 500,
                border: "1px solid #fecaca",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* ODS Selector */}
          <div className="dashboard-card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Select ODS Application to Report:
            </label>
            {loading ? (
              <p>Loading applications...</p>
            ) : applications.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>You have not submitted any ODS applications yet.</p>
            ) : (
              <select
                value={selectedAppId}
                onChange={handleAppChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-app)",
                  fontSize: "14px",
                }}
              >
                {applications.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.eventName} ({app.eventType}) • Mentor: {app.mentorName || app.mentor} • Status: {app.status}
                  </option>
                ))}
              </select>
            )}

            {selectedApp && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(30, 58, 99, 0.04)",
                  display: "flex",
                  gap: "20px",
                  fontSize: "13px",
                  flexWrap: "wrap",
                }}
              >
                <span><strong>Event:</strong> {selectedApp.eventName}</span>
                <span><strong>Duration:</strong> {selectedApp.startDate} to {selectedApp.endDate}</span>
                <span><strong>Mentor:</strong> {selectedApp.mentorName || selectedApp.mentor}</span>
                <span>
                  <strong>Proof Status:</strong>{" "}
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        selectedApp.eventReport?.status === "VERIFIED"
                          ? "var(--color-success)"
                          : selectedApp.eventReport?.status === "SUBMITTED"
                          ? "#0284c7"
                          : "#d97706",
                    }}
                  >
                    {selectedApp.eventReport?.status === "VERIFIED"
                      ? "VERIFIED BY MENTOR ✅"
                      : selectedApp.eventReport?.status === "SUBMITTED"
                      ? "SUBMITTED FOR REVIEW ⏳"
                      : selectedApp.eventReport?.status === "CHANGES_REQUESTED"
                      ? "CHANGES REQUESTED ⚠️"
                      : "DRAFT / PENDING SUBMISSION"}
                  </span>
                </span>
              </div>
            )}
          </div>

          {selectedApp && viewMode === "edit" ? (
            /* ================= EDIT MODE ================= */
            <form onSubmit={handleSubmit} className="dashboard-card" style={{ padding: "24px" }}>
              <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "18px" }}>Inbuilt Event Report Form</h2>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
                  The fields below are pre-populated from your event details. You can customize them as needed.
                </p>
              </div>

              {/* Field 1: Role */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Your Participation Role *
                </label>
                <select
                  name="participationRole"
                  value={report.participationRole}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-app)",
                  }}
                >
                  <option value="Individual Participant">Individual Participant</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Core Team Member">Core Team Member</option>
                  <option value="Paper Presenter">Paper Presenter</option>
                  <option value="Workshop Attendee">Workshop Attendee</option>
                  <option value="Winner / Finalist">Winner / Finalist</option>
                </select>
              </div>

              {/* Field 2: Executive Summary */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  1. Executive Summary of Event *
                </label>
                <textarea
                  name="executiveSummary"
                  rows={4}
                  value={report.executiveSummary}
                  onChange={handleChange}
                  required
                  placeholder="Summarize the event purpose, schedule, and your activities..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-app)",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Field 3: Key Learnings */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  2. Key Learnings & Technical Competencies Acquired *
                </label>
                <textarea
                  name="keyLearnings"
                  rows={3}
                  value={report.keyLearnings}
                  onChange={handleChange}
                  required
                  placeholder="Detail tools, frameworks, concepts, or soft skills you gained..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-app)",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Field 4: Outcome & Deliverables */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  3. Project Outcome & Achievement *
                </label>
                <textarea
                  name="projectOutcome"
                  rows={3}
                  value={report.projectOutcome}
                  onChange={handleChange}
                  required
                  placeholder="Mention awards, certificates, rankings, or deliverables achieved..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-app)",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Field 5: Certificate Link */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  4. Certificate / Proof Document URL (Google Drive / DigiLocker / Cloud Link) *
                </label>
                <input
                  type="url"
                  name="certificateUrl"
                  value={report.certificateUrl}
                  onChange={handleChange}
                  required
                  placeholder="https://drive.google.com/file/d/your-certificate-link"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-app)",
                    fontSize: "14px",
                  }}
                />
                <small style={{ color: "var(--text-muted)" }}>
                  Upload your certificate to Drive/Dropbox and paste the viewable link here.
                </small>
              </div>

              {/* Field 6: Photos Link */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  5. Event Geo-Tagged Photographs / Media Album URL (Optional)
                </label>
                <input
                  type="url"
                  name="photosUrl"
                  value={report.photosUrl}
                  onChange={handleChange}
                  placeholder="https://photos.app.goo.gl/your-event-album"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-app)",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Field 7: Additional remarks */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  6. Additional Remarks for Faculty Mentor (Optional)
                </label>
                <textarea
                  name="additionalNotes"
                  rows={2}
                  value={report.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any additional information for your mentor..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-app)",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "var(--color-brand-600)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Submitting Official Report..." : "Submit Official Event Report & Proof 🚀"}
                </button>
              </div>
            </form>
          ) : selectedApp && viewMode === "preview" ? (
            /* ================= FORMAL DOCUMENT PREVIEW ================= */
            <div
              className="dashboard-card"
              style={{
                padding: "36px",
                backgroundColor: "#fff",
                color: "#1e293b",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {/* Formal Header */}
              <div style={{ textAlign: "center", borderBottom: "2px solid #0f172a", paddingBottom: "16px", marginBottom: "24px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a" }}>
                  College On-Duty (ODS) Official Event Report
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Verified Academic & Extracurricular Activity Record
                </p>
              </div>

              {/* Student & Event Meta Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px", fontSize: "13px" }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px", fontWeight: 700, width: "20%", background: "#f8fafc" }}>Student Name:</td>
                    <td style={{ padding: "8px", width: "30%" }}>{user.fullName || "Student"}</td>
                    <td style={{ padding: "8px", fontWeight: 700, width: "20%", background: "#f8fafc" }}>Enrollment No:</td>
                    <td style={{ padding: "8px", width: "30%" }}>{user.enrollmentNumber || "N/A"}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px", fontWeight: 700, background: "#f8fafc" }}>Department / Year:</td>
                    <td style={{ padding: "8px" }}>{user.department || "Engineering"} (Year {user.year || "3"})</td>
                    <td style={{ padding: "8px", fontWeight: 700, background: "#f8fafc" }}>Assigned Mentor:</td>
                    <td style={{ padding: "8px", color: "#1e3a63", fontWeight: 600 }}>
                      {selectedApp.mentorName || selectedApp.mentor}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px", fontWeight: 700, background: "#f8fafc" }}>Event Name:</td>
                    <td style={{ padding: "8px", fontWeight: 600 }}>{selectedApp.eventName}</td>
                    <td style={{ padding: "8px", fontWeight: 700, background: "#f8fafc" }}>Event Type:</td>
                    <td style={{ padding: "8px" }}>{selectedApp.eventType}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px", fontWeight: 700, background: "#f8fafc" }}>Organized By:</td>
                    <td style={{ padding: "8px" }}>{selectedApp.organizer}</td>
                    <td style={{ padding: "8px", fontWeight: 700, background: "#f8fafc" }}>Event Dates:</td>
                    <td style={{ padding: "8px" }}>{selectedApp.startDate} to {selectedApp.endDate}</td>
                  </tr>
                </tbody>
              </table>

              {/* Sections */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "14px", textTransform: "uppercase" }}>
                  1. Executive Summary & Activities:
                </h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#334155", background: "#f8fafc", padding: "12px", borderRadius: "6px" }}>
                  {report.executiveSummary}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "14px", textTransform: "uppercase" }}>
                  2. Role & Responsibilities:
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#334155" }}>
                  <strong>Designated Role:</strong> {report.participationRole}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "14px", textTransform: "uppercase" }}>
                  3. Key Learnings & Competencies:
                </h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#334155", background: "#f8fafc", padding: "12px", borderRadius: "6px" }}>
                  {report.keyLearnings}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "14px", textTransform: "uppercase" }}>
                  4. Outcomes & Certifications:
                </h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#334155", background: "#f8fafc", padding: "12px", borderRadius: "6px" }}>
                  {report.projectOutcome}
                </p>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "14px", textTransform: "uppercase" }}>
                  5. Evidence / Verification Links:
                </h4>
                <p style={{ margin: "4px 0", fontSize: "13px" }}>
                  <strong>Certificate Link:</strong>{" "}
                  {report.certificateUrl ? (
                    <a href={report.certificateUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                      {report.certificateUrl}
                    </a>
                  ) : (
                    <span style={{ color: "#94a3b8" }}>Not provided yet</span>
                  )}
                </p>
                {report.photosUrl && (
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    <strong>Photographs / Album:</strong>{" "}
                    <a href={report.photosUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                      {report.photosUrl}
                    </a>
                  </p>
                )}
              </div>

              {/* Signatures Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", paddingTop: "20px", borderTop: "1px dashed #cbd5e1" }}>
                <div>
                  <p style={{ margin: "0 0 35px 0", fontSize: "12px", color: "#64748b" }}>Student Signature</p>
                  <strong style={{ fontSize: "13px" }}>{user.fullName || "Student"}</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 35px 0", fontSize: "12px", color: "#64748b" }}>Mentor Verification Signature</p>
                  <strong style={{ fontSize: "13px" }}>{selectedApp.mentorName || selectedApp.mentor}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default ProofSubmission;
