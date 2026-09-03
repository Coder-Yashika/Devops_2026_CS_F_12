import { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

// ---- Dummy data (baad me API se aayega) ----
const mentorRequests = [
  { id: 1, student: "Rahul Sharma", event: "Smart India Hackathon", date: "12 Sep 2026", status: "pending" },
  { id: 2, student: "Priya Singh", event: "AI Workshop", date: "18 Sep 2026", status: "pending" },
];

const coordinatorApplications = [
  { id: 1, student: "Aman Verma", event: "Robotics Competition", mentor: "Dr. Mehta", status: "pending" },
  { id: 2, student: "Sneha Rao", event: "Cultural Fest", mentor: "Dr. Kapoor", status: "pending" },
];

const proofsToVerify = [
  { id: 1, student: "Karan Patel", event: "Hackathon 2026", submittedOn: "20 Sep 2026" },
];

const rejectionReasons = [
  "Incomplete documents",
  "Event not relevant to academics",
  "Duplicate application",
  "Missing mentor approval",
];

function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState("mentor"); // 'mentor' | 'coordinator' | 'proof'
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [allowResubmit, setAllowResubmit] = useState(false);

  function openRejectModal(id) {
    setRejectingId(id);
    setReason("");
    setRemarks("");
    setAllowResubmit(false);
  }

  function closeRejectModal() {
    setRejectingId(null);
  }

  function confirmReject() {
    // Abhi sirf UI hai — yahan baad me API call jayegi (POST /api/ods/:id/mentor-decision ya coordinator-decision)
    console.log("Rejected:", { id: rejectingId, reason, remarks, allowResubmit });
    closeRejectModal();
  }

  function handleApprove(id) {
    // Abhi sirf UI hai — yahan baad me API call jayegi
    console.log("Approved:", id);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="faculty" />

      <main className="main-content">
        <Navbar title="Faculty Dashboard" />

        <section className="dashboard-content">
          <div className="welcome-section">
            <div>
              <h1>Welcome, Faculty 👋</h1>
              <p>Review student ODS applications and proofs.</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div>
                <p>Pending Requests</p>
                <h2>{mentorRequests.length + coordinatorApplications.length}</h2>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div>
                <p>Approved</p>
                <h2>24</h2>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div>
                <p>Rejected</p>
                <h2>3</h2>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📤</div>
              <div>
                <p>Proof Pending</p>
                <h2>{proofsToVerify.length}</h2>
              </div>
            </div>
          </div>

          {/* ---- Tabs ---- */}
          <div className="dashboard-tabs">
            <button
              className={activeTab === "mentor" ? "tab active" : "tab"}
              onClick={() => setActiveTab("mentor")}
            >
              Mentor Requests
            </button>
            <button
              className={activeTab === "coordinator" ? "tab active" : "tab"}
              onClick={() => setActiveTab("coordinator")}
            >
              Coordinator Approvals
            </button>
            <button
              className={activeTab === "proof" ? "tab active" : "tab"}
              onClick={() => setActiveTab("proof")}
            >
              Proof Verification
            </button>
          </div>

          {/* ---- Mentor tab ---- */}
          {activeTab === "mentor" && (
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Pending ODS Requests (as Mentor)</h2>
              </div>

              {mentorRequests.map((req) => (
                <div className="application-row" key={req.id}>
                  <div>
                    <strong>{req.student}</strong>
                    <p>{req.event} · {req.date}</p>
                  </div>
                  <div className="row-actions">
                    <span className={`status ${req.status}`}>{req.status}</span>
                    <button className="btn-approve" onClick={() => handleApprove(req.id)}>Approve</button>
                    <button className="btn-reject" onClick={() => openRejectModal(req.id)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---- Coordinator tab ---- */}
          {activeTab === "coordinator" && (
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Pending Applications (as Coordinator)</h2>
              </div>

              {coordinatorApplications.map((app) => (
                <div className="application-row" key={app.id}>
                  <div>
                    <strong>{app.student}</strong>
                    <p>{app.event} · Mentor: {app.mentor}</p>
                  </div>
                  <div className="row-actions">
                    <span className={`status ${app.status}`}>{app.status}</span>
                    <button className="btn-approve" onClick={() => handleApprove(app.id)}>Approve</button>
                    <button className="btn-reject" onClick={() => openRejectModal(app.id)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---- Proof verification tab ---- */}
          {activeTab === "proof" && (
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Proofs Awaiting Verification</h2>
              </div>

              {proofsToVerify.map((p) => (
                <div className="application-row" key={p.id}>
                  <div>
                    <strong>{p.student}</strong>
                    <p>{p.event} · Submitted {p.submittedOn}</p>
                  </div>
                  <div className="row-actions">
                    <button className="btn-approve" onClick={() => handleApprove(p.id)}>Verify</button>
                    <button className="btn-reject" onClick={() => openRejectModal(p.id)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ---- Reject modal ---- */}
      {rejectingId !== null && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Reject application</h3>

            <label>Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select a reason</option>
              {rejectionReasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <label>Remarks (optional)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any additional notes..."
            />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={allowResubmit}
                onChange={(e) => setAllowResubmit(e.target.checked)}
              />
              Allow student to resubmit
            </label>

            <div className="modal-actions">
              <button onClick={closeRejectModal}>Cancel</button>
              <button className="btn-reject" disabled={!reason} onClick={confirmReject}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyDashboard;