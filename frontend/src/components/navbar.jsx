import { useNavigate } from "react-router-dom";

function Navbar({ title = "Dashboard" }) {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const user = storedUser || {
    fullName: "User",
    role: "student",
  };

  const role = user.role || "student";

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="navbar">

      <div>
        <h2>{title}</h2>

        <p>
          College On-Duty Management System
        </p>
      </div>

      <div className="navbar-right">

        <button className="notification-btn">
          🔔
        </button>

        <div className="profile">

          <div className="avatar">
            {getInitials(user.fullName)}
          </div>

          <div>
            <strong>
              {user.fullName || "User"}
            </strong>

            <span>
              {role === "faculty"
                ? "Faculty"
                : role === "admin"
                ? "Admin"
                : "Student"}
            </span>
          </div>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;