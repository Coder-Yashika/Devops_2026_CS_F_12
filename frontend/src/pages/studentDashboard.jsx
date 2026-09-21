import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import api from "../api/client";

function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH APPLICATIONS FROM BACKEND
  // ==========================================

  const fetchApplications = async () => {
    try {
      const response = await api.get("/ods/my-applications");

      if (response.data.success) {
        setApplications(response.data.applications || []);
        setError("");
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchApplications();
  }, []);

  // ==========================================
  // AUTO REFRESH
  // ==========================================
  // This checks MongoDB every 10 seconds.
  // So if faculty changes an application status,
  // student's dashboard gets updated automatically.

  useEffect(() => {
    const interval = setInterval(() => {
      fetchApplications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // REFRESH WHEN USER COMES BACK TO TAB
  // ==========================================

  useEffect(() => {
    const handleFocus = () => {
      fetchApplications();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // ==========================================
  // APPLICATION COUNTS
  // ==========================================

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (app) =>
      app.status === "MENTOR_PENDING" ||
      app.status === "COORDINATOR_PENDING"
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "APPROVED"
  ).length;

  const rejectedApplications = applications.filter(
    (app) => app.status === "REJECTED"
  ).length;

  const proofPendingApplications = applications.filter(
    (app) => app.status === "PROOF_PENDING"
  ).length;

  const completedApplications = applications.filter(
    (app) => app.status === "COMPLETED"
  ).length;

  // ==========================================
  // DASHBOARD CARDS
  // ==========================================

  const cards = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: "📄",
      status: "ALL",
    },
    {
      title: "Pending",
      value: pendingApplications,
      icon: "⏳",
      status: "PENDING",
    },
    {
      title: "Approved",
      value: approvedApplications,
      icon: "✅",
      status: "APPROVED",
    },
    {
      title: "Rejected",
      value: rejectedApplications,
      icon: "❌",
      status: "REJECTED",
    },
    {
      title: "Proof Pending",
      value: proofPendingApplications,
      icon: "📤",
      status: "PROOF_PENDING",
    },
    {
      title: "Completed",
      value: completedApplications,
      icon: "🎓",
      status: "COMPLETED",
    },
  ];

  // ==========================================
  // FILTER APPLICATIONS
  // ==========================================

  const filteredApplications = applications.filter((app) => {
    if (selectedStatus === "ALL") {
      return true;
    }

    if (selectedStatus === "PENDING") {
      return (
        app.status === "MENTOR_PENDING" ||
        app.status === "COORDINATOR_PENDING"
      );
    }

    return app.status === selectedStatus;
  });

  // ==========================================
  // STATUS TEXT
  // ==========================================

  const getStatusText = (status) => {
    switch (status) {
      case "MENTOR_PENDING":
        return "Mentor Pending";

      case "MENTOR_APPROVED":
        return "Mentor Approved";

      case "COORDINATOR_PENDING":
        return "Coordinator Pending";

      case "APPROVED":
        return "Approved";

      case "REJECTED":
        return "Rejected";

      case "PROOF_PENDING":
        return "Proof Pending";

      case "PROOF_SUBMITTED":
        return "Proof Submitted";

      case "COMPLETED":
        return "Completed";

      default:
        return status;
    }
  };

  // ==========================================
  // STATUS CSS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "approved";

      case "REJECTED":
        return "rejected";

      case "PROOF_PENDING":
        return "proof-pending";

      case "COMPLETED":
        return "completed";

      case "MENTOR_PENDING":
      case "MENTOR_APPROVED":
      case "COORDINATOR_PENDING":
        return "pending";

      default:
        return "pending";
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // UPCOMING EVENTS
  // ==========================================

  const upcomingEvents = applications
    .filter((app) => {
      if (!app.startDate) return false;

      const eventDate = new Date(app.startDate);

      return (
        !isNaN(eventDate.getTime()) &&
        eventDate >= new Date()
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startDate) -
        new Date(b.startDate)
    )
    .slice(0, 3);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-layout">

      <Sidebar role="student" />

      <main className="main-content">

        <Navbar title="Student Dashboard" />

        <section className="dashboard-content">

          {/* ==================================
              WELCOME
          ================================== */}

          <div className="welcome-section">

            <div>
              <h1>
                Welcome back, Student 👋
              </h1>

              <p>
                Manage your ODS applications and
                event activities.
              </p>
            </div>

            <Link
              to="/student/apply-ods"
              className="primary-btn apply-btn"
            >
              + Apply for ODS
            </Link>

          </div>


          {/* ==================================
              STAT CARDS
          ================================== */}

          <div className="stats-grid">

            {cards.map((card) => (

              <div
                key={card.title}
                className={`stat-card ${
                  selectedStatus === card.status
                    ? "active-stat-card"
                    : ""
                }`}
                onClick={() =>
                  setSelectedStatus(card.status)
                }
              >

                <div className="stat-icon">
                  {card.icon}
                </div>

                <div>
                  <p>{card.title}</p>
                  <h2>{card.value}</h2>
                </div>

              </div>

            ))}

          </div>


          {/* ==================================
              DASHBOARD GRID
          ================================== */}

          <div className="dashboard-grid">


            {/* ==================================
                APPLICATIONS
            ================================== */}

            <div className="dashboard-card">

              <div className="card-header">

                <h2>
                  {selectedStatus === "ALL"
                    ? "Recent Applications"
                    : `${
                        cards.find(
                          (card) =>
                            card.status ===
                            selectedStatus
                        )?.title
                      } Applications`}
                </h2>

                <Link to="/student/applications">
                  View All
                </Link>

              </div>


              {/* LOADING */}

              {loading && (
                <div className="empty-state">
                  Loading applications...
                </div>
              )}


              {/* ERROR */}

              {!loading && error && (
                <div className="empty-state">
                  {error}
                </div>
              )}


              {/* APPLICATIONS */}

              {!loading &&
                !error &&
                filteredApplications.length > 0 && (

                  <div className="applications-list">

                    {filteredApplications
                      .slice(0, 5)
                      .map((app) => (

                        <div
                          className="application-row"
                          key={app._id}
                        >

                          <div>

                            <strong>
                              {app.eventName}
                            </strong>

                            <p>
                              {app.eventType}
                              {" • "}
                              {formatDate(
                                app.startDate
                              )}
                            </p>

                          </div>

                          <span
                            className={`status ${getStatusClass(
                              app.status
                            )}`}
                          >
                            {getStatusText(
                              app.status
                            )}
                          </span>

                        </div>

                      ))}

                  </div>

                )}


              {/* NO APPLICATIONS */}

              {!loading &&
                !error &&
                filteredApplications.length === 0 && (

                  <div className="empty-state">

                    <p>
                      No applications found.
                    </p>

                    {selectedStatus !== "ALL" && (
                      <button
                        className="secondary-btn"
                        onClick={() =>
                          setSelectedStatus("ALL")
                        }
                      >
                        Show All Applications
                      </button>
                    )}

                  </div>

                )}

            </div>


            {/* ==================================
                UPCOMING EVENTS
            ================================== */}

            <div className="dashboard-card">

              <div className="card-header">

                <h2>
                  Upcoming Events
                </h2>

              </div>


              {upcomingEvents.length > 0 ? (

                upcomingEvents.map((event) => {

                  const eventDate =
                    new Date(event.startDate);

                  return (
                    <div
                      className="event-item"
                      key={event._id}
                    >

                      <div className="event-date">

                        <strong>
                          {eventDate.getDate()}
                        </strong>

                        <span>
                          {eventDate
                            .toLocaleString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )
                            .toUpperCase()}
                        </span>

                      </div>

                      <div>

                        <strong>
                          {event.eventName}
                        </strong>

                        <p>
                          {event.location}
                        </p>

                      </div>

                    </div>
                  );
                })

              ) : (

                <div className="empty-state">

                  <p>
                    No upcoming events.
                  </p>

                </div>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;