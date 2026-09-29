import { Link } from "react-router-dom";

function Sidebar({ role = "student" }) {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-box small">
          ODS
        </div>

        <div>
          <h2>College ODS</h2>
          <span>Management System</span>
        </div>
      </div>

      <nav>

        {role === "student" && (
          <>
            <Link to="/student/dashboard">
              Dashboard
            </Link>

            <Link to="/student/apply-ods">
              Apply ODS
            </Link>

            <a href="#">
              My Applications
            </a>

            <a href="#">
              Approved ODS
            </a>

            <a href="#">
              Proof Submission
            </a>

            <a href="#">
              Notifications
            </a>

            <a href="#">
              Profile
            </a>
          </>
        )}

        {role === "faculty" && (
          <>
            <Link to="/faculty/dashboard">
              Dashboard
            </Link>

            <a href="#">
              Pending Requests
            </a>

            <a href="#">
              Students
            </a>

            <a href="#">
              Proof Verification
            </a>

            <a href="#">
              Approval History
            </a>

            <a href="#">
              Profile
            </a>
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin/dashboard">
              Dashboard
            </Link>

            <a href="#">Students</a>
            <a href="#">Faculty</a>
            <a href="#">Mentors</a>
            <a href="#">Coordinators</a>
            <a href="#">Departments</a>
            <a href="#">Event Types</a>
            <a href="#">ODS Applications</a>
            <a href="#">Reports</a>
            <a href="#">Analytics</a>
          </>
        )}

      </nav>

    </aside>
  );
}

export default Sidebar;