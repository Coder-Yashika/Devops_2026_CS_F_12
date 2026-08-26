import { useEffect, useState } from "react";

import api from "../api/client";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
function FacultyDashboard() {
    const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    proofPending: 0,
  });

  const [applications, setApplications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  // =============================
  // LOAD FACULTY DASHBOARD
  // =============================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/faculty/dashboard");

      setStats(data.stats);
      setApplications(data.applications || []);
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // APPROVE / REJECT
  // =============================

  const handleDecision = async (
    applicationId,
    decision
  ) => {
    try {
      await api.put(
        `/faculty/ods/${applicationId}/decision`,
        {
          decision,
        }
      );

      // Reload dashboard after decision
      await loadDashboard();

    } catch (error) {
      console.error(
        "Decision error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update application."
      );
    }
  };

  // =============================
  // DASHBOARD CARDS
  // =============================

  const cards = [
  {
    title: "Pending Requests",
    value: stats.pending,
    icon: "⏳",
    path: "/faculty/requests",
  },
  {
    title: "Approved",
    value: stats.approved,
    icon: "✅",
    path: "/faculty/approved",
  },
  {
    title: "Rejected",
    value: stats.rejected,
    icon: "❌",
    path: "/faculty/rejected",
  },
  {
    title: "Proof Pending",
    value: stats.proofPending,
    icon: "📤",
    path: "/faculty/proof",
  },
];

  // =============================
  // FILTER APPLICATIONS
  // =============================

  const filteredApplications =
    applications.filter((application) => {
      if (selectedFilter === "pending") {
        return (
          application.mentorStatus === "PENDING"
        );
      }

      if (selectedFilter === "approved") {
        return (
          application.mentorStatus === "APPROVED"
        );
      }

      if (selectedFilter === "rejected") {
        return (
          application.mentorStatus === "REJECTED"
        );
      }

      if (selectedFilter === "proof") {
        return (
          application.status === "PROOF_PENDING"
        );
      }

      return true;
    });

  // =============================
  // SECTION TITLE
  // =============================

  const getSectionTitle = () => {
    if (selectedFilter === "pending") {
      return "Pending ODS Requests";
    }

    if (selectedFilter === "approved") {
      return "Approved ODS Applications";
    }

    if (selectedFilter === "rejected") {
      return "Rejected ODS Applications";
    }

    if (selectedFilter === "proof") {
      return "Proof Pending";
    }

    return "ODS Applications";
  };

  return (
    <div className="dashboard-layout">

      <Sidebar
  role="faculty"
  
/>              

      <main className="main-content">

        <Navbar title="Faculty Dashboard" />

        <section className="dashboard-content">

          {/* =========================
              WELCOME
          ========================= */}

          <div className="welcome-section">

            <div>
              <h1>
                Welcome, Faculty 👋
              </h1>

              <p>
                Review student ODS applications
                and proofs.
              </p>
            </div>

          </div>

          {/* =========================
              STAT CARDS
          ========================= */}

          <div className="stats-grid">

            {cards.map((card) => (

              <button
                key={card.title}
                type="button"
                className={`stat-card ${
                  selectedFilter === card.filter
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedFilter(card.filter)
                }
              >

                <div className="stat-icon">
                  {card.icon}
                </div>

                <div>
                  <p>{card.title}</p>

                  <h2>{card.value}</h2>
                </div>

                <span className="card-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

          {/* =========================
              APPLICATIONS
          ========================= */}

          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                {getSectionTitle()}
              </h2>

              <span>
                {filteredApplications.length}{" "}
                application
                {filteredApplications.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            {/* LOADING */}

            {loading && (
              <div className="empty-state">
                Loading applications...
              </div>
            )}

            {/* NO DATA */}

            {!loading &&
              filteredApplications.length === 0 && (
                <div className="empty-state">
                  No applications found.
                </div>
              )}

            {/* APPLICATION LIST */}

            {!loading &&
              filteredApplications.length > 0 &&
              filteredApplications.map(
                (application) => (

                  <div
                    className="application-row"
                    key={application._id}
                  >

                    <div className="application-info">

                      <strong>
                        {application.student
                          ?.fullName ||
                          application.studentName ||
                          "Unknown Student"}
                      </strong>

                      <p>
                        {application.eventName ||
                          "ODS Event"}

                        {application.eventType &&
                          ` • ${application.eventType}`}
                      </p>

                      {application.student
                        ?.enrollmentNumber && (
                        <small>
                          Enrollment:{" "}
                          {
                            application.student
                              .enrollmentNumber
                          }
                        </small>
                      )}

                    </div>

                    <div className="application-right">

                      <span
                        className={`status ${
                          application.mentorStatus
                            ?.toLowerCase() ||
                          "pending"
                        }`}
                      >
                        {application.mentorStatus ||
                          "PENDING"}
                      </span>

                      {/* APPROVE / REJECT */}

                      {application.mentorStatus ===
                        "PENDING" && (

                        <div className="application-actions">

                          <button
                            type="button"
                            className="approve-btn"
                            onClick={() =>
                              handleDecision(
                                application._id,
                                "APPROVED"
                              )
                            }
                          >
                            ✓ Approve
                          </button>

                          <button
                            type="button"
                            className="reject-btn"
                            onClick={() =>
                              handleDecision(
                                application._id,
                                "REJECTED"
                              )
                            }
                          >
                            ✕ Reject
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                )
              )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default FacultyDashboard;