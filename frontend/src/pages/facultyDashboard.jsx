import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

function FacultyDashboard() {

  return (
    <div className="dashboard-layout">

      <Sidebar role="faculty" />

      <main className="main-content">
        <Navbar title="Faculty Dashboard" />

        <section className="dashboard-content">

          <div className="welcome-section">
            <div>
              <h1>Welcome, Faculty 👋</h1>

              <p>
                Review student ODS applications and proofs.
              </p>
            </div>
          </div>

          {/* =========================
              STAT CARDS
          ========================= */}

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon">⏳</div>

              <div>
                <p>Pending Requests</p>
                <h2>8</h2>
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
                <h2>5</h2>
              </div>
            </div>

          </div>

          {/* =========================
              APPLICATIONS
          ========================= */}

          <div className="dashboard-card">

            <div className="card-header">
              <h2>Pending ODS Requests</h2>

              <button>
                View All
              </button>
            </div>

            <div className="application-row">

              <div>
                <strong>
                  Rahul Sharma
                </strong>

                <p>
                  Smart India Hackathon
                </p>
              </div>

              <span className="status pending">
                Pending
              </span>

            </div>

            <div className="application-row">

              <div>
                <strong>
                  Priya Singh
                </strong>

                <p>
                  AI Workshop
                </p>
              </div>

              <span className="status pending">
                Pending
              </span>

            </div>

          </div>
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