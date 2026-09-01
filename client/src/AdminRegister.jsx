import { useState } from "react";
import axios from "axios";

function AdminRegister({ setPage }) {
  const [formData, setFormData] = useState({
    organization: "",
    username: "",
    address: "",
    area: "",
    email: "",
    purpose: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const registerAdmin = async () => {
    if (
      !formData.organization ||
      !formData.username ||
      !formData.address ||
      !formData.area ||
      !formData.email ||
      !formData.purpose ||
      !formData.password
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://daims.onrender.com/admin/register",
        formData
      );

      alert(response.data.message || "Admin registered successfully");

      setFormData({
        organization: "",
        username: "",
        address: "",
        area: "",
        email: "",
        purpose: "",
        password: "",
      });

      setPage("login");
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message || "Registration failed");
      } else {
        alert("Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url('/animal-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* HEADER */}
      <header
        style={{
          background: "#086b4f",
          color: "white",
          borderBottom: "5px solid #f5c400",
          padding: "18px 15px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              lineHeight: "1",
            }}
          >
            🐾
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "700",
              }}
            >
              Admin Registration
            </h1>

            <div
              style={{
                fontSize: "18px",
                marginTop: "5px",
              }}
            >
              Dead and Injured Animal Management System
            </div>
          </div>
        </div>
      </header>

      {/* BACK BUTTON */}
      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "20px auto 0",
          padding: "0 20px",
        }}
      >
        <button
          onClick={() => setPage("home")}
          style={{
            background: "white",
            color: "#086b4f",
            border: "1px solid #086b4f",
            borderRadius: "7px",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← &nbsp; Back
        </button>
      </div>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "25px 15px 40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "850px",
            background: "rgba(255,255,255,0.96)",
            borderRadius: "15px",
            padding: "32px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
            border: "1px solid #ddd",
          }}
        >

          {/* TITLE ICON */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#e7f2ed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 20px",
              fontSize: "45px",
            }}
          >
            🛡️👤
          </div>

          <h2
            style={{
              textAlign: "center",
              color: "#086b4f",
              fontSize: "34px",
              marginBottom: "8px",
              fontWeight: "700",
            }}
          >
            Admin Registration
          </h2>

          <div
            style={{
              width: "80px",
              height: "4px",
              background: "#087b5b",
              margin: "0 auto 28px",
              borderRadius: "5px",
            }}
          />

          {/* ORGANIZATION */}
          <div className="admin-field">
            <span className="admin-icon">🏛️</span>

            <input
              type="text"
              name="organization"
              placeholder="Organization"
              value={formData.organization}
              onChange={handleChange}
            />
          </div>

          {/* USERNAME */}
          <div className="admin-field">
            <span className="admin-icon">👤</span>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* ADDRESS */}
          <div className="admin-field">
            <span className="admin-icon">📍</span>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* AREA */}
          <div className="admin-field">
            <span className="admin-icon">🗺️</span>

            <input
              type="text"
              name="area"
              placeholder="Area"
              value={formData.area}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="admin-field">
            <span className="admin-icon">✉️</span>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* PURPOSE */}
          <div className="admin-field">
            <span className="admin-icon">📄</span>

            <input
              type="text"
              name="purpose"
              placeholder="Purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="admin-field">
            <span className="admin-icon">🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
                padding: "0 12px",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* REGISTER BUTTON */}
          <button
            onClick={registerAdmin}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "14px",
              background: loading ? "#777" : "#087b5b",
              color: "white",
              border: "none",
              borderRadius: "7px",
              fontSize: "20px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Registering..." : "👤+  Register Admin"}
          </button>

        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: "#086b4f",
          color: "white",
          borderTop: "4px solid #f5c400",
          textAlign: "center",
          padding: "20px 10px",
          fontSize: "18px",
          fontStyle: "italic",
        }}
      >
        🐾 &nbsp; Be Kind to Animals. They Feel. They Matter. &nbsp; 🐾
      </footer>

      {/* RESPONSIVE CSS */}
      <style>{`
        .admin-field {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 58px;
          border: 1px solid #d5dadd;
          border-radius: 7px;
          margin-bottom: 15px;
          background: white;
          overflow: hidden;
        }

        .admin-icon {
          width: 68px;
          min-width: 68px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f6f3;
          border-right: 1px solid #d5dadd;
          font-size: 24px;
        }

        .admin-field input {
          flex: 1;
          width: 100%;
          height: 58px;
          border: none;
          outline: none;
          padding: 0 18px;
          font-size: 17px;
          color: #333;
          background: transparent;
        }

        .admin-field input::placeholder {
          color: #777;
        }

        .admin-field:focus-within {
          border-color: #087b5b;
          box-shadow: 0 0 0 2px rgba(8,123,91,0.1);
        }

        @media (max-width: 600px) {
          header {
            padding: 14px 10px !important;
          }

          header h1 {
            font-size: 23px !important;
          }

          header div div {
            font-size: 14px !important;
          }

          main {
            padding: 20px 10px 30px !important;
          }

          main > div {
            padding: 22px 15px !important;
            border-radius: 12px !important;
          }

          .admin-field {
            min-height: 52px;
          }

          .admin-icon {
            width: 52px;
            min-width: 52px;
            height: 52px;
            font-size: 20px;
          }

          .admin-field input {
            height: 52px;
            font-size: 15px;
            padding: 0 12px;
          }

          h2 {
            font-size: 27px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminRegister;