import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Inbox,
  Users,
  CheckCircle2,
  XCircle,
  FileCheck,
  History,
  Bell,
  User,
  LogOut,
  X,
} from "lucide-react";

function Sidebar({
  role = "student",
  isOpen = false,
  onClose = () => {},
  pendingCount = 0,
  notificationCount = 0,
}) {
  const navigate = useNavigate();

  // Get currently logged-in user
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const studentLinks = [
    {
      name: "Dashboard",
      path: "/student",
      icon: LayoutDashboard,
    },
    {
      name: "Apply ODS",
      path: "/student/apply-ods",
      icon: FileCheck,
    },
    {
      name: "My Applications",
      path: "/student/applications",
      icon: Inbox,
    },
    {
      name: "Approved ODS",
      path: "/student/approved",
      icon: CheckCircle2,
    },
    {
      name: "Proof Submission",
      path: "/student/proof",
      icon: FileCheck,
    },
    {
      name: "Notifications",
      path: "/student/notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      path: "/student/profile",
      icon: User,
    },
  ];

  const facultyLinks = [
    {
      name: "Dashboard",
      path: "/faculty",
      icon: LayoutDashboard,
    },
    {
      name: "Pending Requests",
      path: "/faculty/requests",
      icon: Inbox,
    },
    {
      name: "My Students",
      path: "/faculty/students",
      icon: Users,
    },
    {
      name: "Approved ODS",
      path: "/faculty/approved",
      icon: CheckCircle2,
    },
    {
      name: "Rejected ODS",
      path: "/faculty/rejected",
      icon: XCircle,
    },
    {
      name: "Proof Verification",
      path: "/faculty/proof",
      icon: FileCheck,
    },
    {
      name: "Approval History",
      path: "/faculty/history",
      icon: History,
    },
    {
      name: "Notifications",
      path: "/faculty/notifications",
      icon: Bell,
    },
    {
      name: "My Profile",
      path: "/faculty/profile",
      icon: User,
    },
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: Users,
    },
    {
      name: "Faculty",
      path: "/admin/faculty",
      icon: Users,
    },
    {
      name: "ODS Applications",
      path: "/admin/applications",
      icon: FileCheck,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: History,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: User,
    },
  ];

  let links = studentLinks;

  if (role === "faculty") {
    links = facultyLinks;
  }

  if (role === "admin") {
    links = adminLinks;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) {
      return role === "faculty"
        ? "F"
        : role === "admin"
        ? "A"
        : "S";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* =========================
            LOGO
        ========================= */}

        <div className="sidebar-logo">

          <div className="logo-box small">
            ODS
          </div>

          <div>
            <h2>
              {role === "faculty"
                ? "Faculty Portal"
                : role === "admin"
                ? "Admin Portal"
                : "College ODS"}
            </h2>

            <span>
              {role === "faculty"
                ? "Mentor Management"
                : role === "admin"
                ? "System Management"
                : "Management System"}
            </span>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>


        {/* =========================
            USER INFORMATION
        ========================= */}

        <div className="sidebar-user">

          <div className="faculty-avatar">
            {getInitials(user.fullName)}
          </div>

          <div className="faculty-user-details">

            <strong>
              {user.fullName ||
                (role === "faculty"
                  ? "Faculty"
                  : role === "admin"
                  ? "Administrator"
                  : "Student")}
            </strong>

            {role === "faculty" && (
              <>
                <span>
                  {user.department || "Department"}
                </span>

                <small>
                  {user.designation || "Faculty"}
                </small>
              </>
            )}

            {role === "student" && (
              <>
                <span>
                  {user.department || "Student"}
                </span>

                <small>
                  {user.enrollmentNumber || ""}
                </small>
              </>
            )}

            {role === "admin" && (
              <span>
                Administrator
              </span>
            )}

          </div>

        </div>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="sidebar-nav">

          <p className="sidebar-section-title">
            {role === "faculty"
              ? "FACULTY MENU"
              : role === "admin"
              ? "ADMIN MENU"
              : "STUDENT MENU"}
          </p>


          {links.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <Icon size={19} />

                <span>
                  {item.name}
                </span>


                {/* Faculty pending requests */}
                {item.name === "Pending Requests" &&
                  role === "faculty" &&
                  pendingCount > 0 && (
                    <span className="notification-badge">
                      {pendingCount}
                    </span>
                  )}


                {/* Notifications */}
                {item.name === "Notifications" &&
                  notificationCount > 0 && (
                    <span className="notification-badge">
                      {notificationCount}
                    </span>
                  )}

              </NavLink>
            );

          })}

        </nav>


        {/* =========================
            BOTTOM
        ========================= */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;