import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function StudentDashboard() {

  const cards = [
    {
      title: "Total Applications",
      value: "12",
      icon: "📄",
    },
    {
      title: "Pending",
      value: "3",
      icon: "⏳",
    },
    {
      title: "Approved",
      value: "7",
      icon: "✅",
    },
    {
      title: "Rejected",
      value: "2",
      icon: "❌",
    },
    {
      title: "Proof Pending",
      value: "2",
      icon: "📤",
    },
    {
      title: "Completed",
      value: "5",
      icon: "🎓",
    },
  ];

  return (
    <div className="dashboard-layout">

      <Sidebar role="student" />

      <main className="main-content">

        <Navbar title="Student Dashboard" />

        <section className="dashboard-content">

          <div className="welcome-section">

            <div>
              <h1>Welcome back, Student 👋</h1>

              <p>
                Manage your ODS applications and event activities.
              </p>
            </div>

            <Link
              to="/student/apply-ods"
              className="primary-btn apply-btn"
            >
              + Apply for ODS
            </Link>

          </div>

          <div className="stats-grid">

            {cards.map((card) => (
              <div
                className="stat-card"
                key={card.title}
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

          <div className="dashboard-grid">

            <div className="dashboard-card">

              <div className="card-header">
                <h2>Recent Applications</h2>

                <button>
                  View All
                </button>
              </div>

              <div className="application-row">

                <div>
                  <strong>
                    Smart India Hackathon
                  </strong>

                  <p>
                    Hackathon • 20 Sep 2026
                  </p>
                </div>

                <span className="status approved">
                  Approved
                </span>

              </div>

              <div className="application-row">

                <div>
                  <strong>
                    AI Workshop
                  </strong>

                  <p>
                    Workshop • 28 Sep 2026
                  </p>
                </div>

                <span className="status pending">
                  Pending
                </span>

              </div>

              <div className="application-row">

                <div>
                  <strong>
                    Technical Competition
                  </strong>

                  <p>
                    Competition • 05 Oct 2026
                  </p>
                </div>

                <span className="status rejected">
                  Rejected
                </span>

              </div>

            </div>

            <div className="dashboard-card">

              <div className="card-header">
                <h2>Upcoming Events</h2>
              </div>

              <div className="event-item">

                <div className="event-date">
                  <strong>20</strong>
                  <span>SEP</span>
                </div>

                <div>
                  <strong>
                    Smart India Hackathon
                  </strong>

                  <p>
                    New Delhi
                  </p>
                </div>

              </div>

              <div className="event-item">

                <div className="event-date">
                  <strong>28</strong>
                  <span>SEP</span>
                </div>

                <div>
                  <strong>
                    AI Workshop
                  </strong>

                  <p>
                    College Campus
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;