import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

function Navbar({ title = "Dashboard" }) {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const user = storedUser || {
    fullName: "User",
    role: "student",
  };
  const role = user.role || "student";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await api.get("/notifications");
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // ignore in background
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markOneRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

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

  const goToProfile = () => {
    if (role === "student") navigate("/student/profile");
    else if (role === "faculty") navigate("/faculty/profile");
  };

  return (
    <header className="navbar" style={{ position: "relative" }}>
      <div>
        <h2>{title}</h2>
        <p>College On-Duty Management System</p>
      </div>

      <div className="navbar-right">
        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            className="notification-btn"
            onClick={() => setShowDropdown(!showDropdown)}
            title="Notifications"
            style={{
              position: "relative",
              cursor: "pointer",
              fontSize: "18px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              background: showDropdown ? "var(--color-brand-50, #eef2fb)" : "var(--bg-surface)",
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "#dc2626",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "10px",
                  padding: "1px 6px",
                  boxShadow: "0 2px 5px rgba(220, 38, 38, 0.4)",
                  animation: "pulse 2s infinite",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Popover */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                width: "360px",
                maxHeight: "420px",
                backgroundColor: "var(--bg-surface, #ffffff)",
                border: "1px solid var(--border-subtle, #e2e5ec)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border-subtle, #e2e5ec)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--color-brand-50, #f8fafc)",
                }}
              >
                <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                  Notifications {unreadCount > 0 && `(${unreadCount} new)`}
                </strong>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-brand-600, #1e3a63)",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ overflowY: "auto", maxHeight: "350px" }}>
                {notifications.length === 0 ? (
                  <p style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        if (!n.read) markOneRead(n._id, { stopPropagation: () => {} });
                        if (role === "student") navigate("/student/proof");
                        else if (role === "faculty") navigate("/faculty");
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
                        backgroundColor: n.read ? "transparent" : "rgba(30, 58, 99, 0.04)",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <strong
                          style={{
                            fontSize: "13px",
                            color: n.read ? "var(--text-primary)" : "var(--color-brand-600)",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {n.type === "success" && "✅"}
                          {n.type === "action_required" && "⚡"}
                          {n.type === "warning" && "⚠️"}
                          {n.type === "info" && "ℹ️"}
                          {n.title}
                        </strong>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Info */}
        <div
          className="profile"
          onClick={goToProfile}
          title="View profile"
          style={{ cursor: "pointer" }}
        >
          <div className="avatar">{getInitials(user.fullName)}</div>

          <div>
            <strong>{user.fullName || "User"}</strong>
            <span>
              {role === "faculty"
                ? "Faculty"
                : role === "admin"
                ? "Admin"
                : "Student"}
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;