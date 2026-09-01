import { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";

function AdminLogin({ setPage, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://daims.onrender.com/admin/login",
        {
          username,
          password,
        }
      );

      alert(response.data.message || "Login Successful");

      // Admin area save
      if (response.data.admin?.area) {
        localStorage.setItem("adminArea", response.data.admin.area);
      }

      onLogin();
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message || "Invalid username or password");
      } else {
        alert("Server Error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* HEADER */}
      <header className="login-header">
        <div className="header-content">
          <div className="paw-icon">🐾</div>

          <div>
            <h1>Dead and Injured Animal Management System</h1>
            <p>Efficient Reporting, Faster Action, Better Care.</p>
          </div>
        </div>
      </header>

      {/* BACK BUTTON */}
      <div className="login-back-area">
        <button
          className="back-button"
          onClick={() => setPage("home")}
        >
          ← &nbsp; Back
        </button>
      </div>

      {/* LOGIN CARD */}
      <main className="login-main">

        <div className="login-card">

          {/* LOCK ICON */}
          <div className="lock-circle">
            🔒
          </div>

          <h2>Admin Login</h2>

          <div className="title-line"></div>

          <form onSubmit={handleLogin}>

            {/* USERNAME */}
            <div className="login-input-box">
              <div className="input-icon">
                👤
              </div>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="login-input-box">
              <div className="input-icon">
                🔒
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* LOGIN */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>

      </main>

      {/* FEATURES */}
      <section className="login-features">

        <div className="feature">
          <div className="feature-icon">🛡️</div>
          <div>
            <strong>Secure Access</strong>
            <span>Protected System</span>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">⏱️</div>
          <div>
            <strong>Quick Response</strong>
            <span>Timely Action</span>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">👥</div>
          <div>
            <strong>Better Service</strong>
            <span>For Animals & Citizens</span>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="login-footer">
        Be Kind to Animals. They Feel. They Matter. 🐾
      </footer>

    </div>
  );
}

export default AdminLogin;