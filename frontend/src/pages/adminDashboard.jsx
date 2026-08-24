import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

function AdminDashboard() {

  const stats = [
    ["👨‍🎓", "Total Students", "1250"],
    ["👨‍🏫", "Total Faculty", "86"],
    ["📄", "Total ODS", "438"],
    ["⏳", "Pending ODS", "32"],
    ["✅", "Approved ODS", "361"],
    ["📤", "Proof Pending", "45"],
  ];

  return (
    <div className="dashboard-layout">

      <Sidebar role="admin" />

      <main className="main-content">

        <Navbar title="Admin Dashboard" />

        <section className="dashboard-content">

          <div className="welcome-section">

            <div>
              <h1>Admin Dashboard</h1>

              <p>
                Manage the complete College ODS system.
              </p>
            </div>

          </div>

          <div className="stats-grid">

            {stats.map(([icon, title, value]) => (

              <div
                className="stat-card"
                key={title}
              >

                <div className="stat-icon">
                  {icon}
                </div>

                <div>
                  <p>{title}</p>
                  <h2>{value}</h2>
                </div>

              </div>

            ))}

          </div>

          <div className="dashboard-grid">

            <div className="dashboard-card">

              <div className="card-header">
                <h2>Quick Management</h2>
              </div>

              <div className="admin-actions">

                <button>
                  Manage Students
                </button>

                <button>
                  Manage Faculty
                </button>

                <button>
                  Manage Departments
                </button>

                <button>
                  Manage Event Types
                </button>

              </div>

            </div>

            <div className="dashboard-card">

              <div className="card-header">
                <h2>Reports</h2>
              </div>

              <div className="admin-actions">

                <button>
                  Student Report
                </button>

                <button>
                  Department Report
                </button>

                <button>
                  ODS Report
                </button>

                <button>
                  Proof Pending Report
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;