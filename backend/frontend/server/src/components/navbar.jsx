import { useNavigate } from "react-router-dom";

function Navbar({ title = "Dashboard" }) {

  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div>
        <h2>{title}</h2>
        <p>College On-Duty Management System</p>
      </div>

      <div className="navbar-right">

        <button className="notification-btn">
          🔔
        </button>

        <div className="profile">
          <div className="avatar">
            Y
          </div>

          <div>
            <strong>User</strong>
            <span>Student</span>
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