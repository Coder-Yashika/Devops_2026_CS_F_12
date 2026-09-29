import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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

    </div>
  );
}

export default FacultyDashboard;