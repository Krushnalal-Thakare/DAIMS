import { useEffect, useState } from "react";
import axios from "axios";

function Admin({ onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const API_URL = "https://daims.onrender.com";

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const area = localStorage.getItem("adminArea");

      const res = await axios.get(
        `${API_URL}/complaints/${area}`
      );

      setComplaints(res.data);
    } catch (error) {
      console.log(error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/complaint/${id}`,
        { status }
      );

      fetchComplaints();
    } catch (error) {
      console.log(error);
      alert("Failed to update complaint status");
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API_URL}/complaint/${id}`
      );

      alert(response.data.message);
      fetchComplaints();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete complaint"
      );
    }
  };

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const processing = complaints.filter(
    (c) => c.status === "In Process"
  ).length;

  const completed = complaints.filter(
    (c) => c.status === "Completed"
  ).length;

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
        flexDirection: "column"
      }}
    >
      {/* TOP HEADER */}
      <header
        style={{
          background: "#064b35",
          color: "white",
          padding: "20px 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ fontSize: "48px" }}>🐾</div>

          <div>
            <h2 style={{ margin: 0, fontWeight: "700" }}>
              Dead and Injured Animal Management System
            </h2>

            <p style={{ margin: 0, opacity: 0.9 }}>
              Efficient Reporting. Faster Action. Better Care.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "18px" }}>
            👤 Admin
          </span>

          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #aaa",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: "250px",
            minHeight: "calc(100vh - 100px)",
            background: "rgba(255,255,255,0.7)",
            borderRight: "1px solid #ccc",
            padding: "30px 15px"
          }}
        >
          <SidebarButton
            icon="▦"
            text="Dashboard"
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
          />

          <SidebarButton
            icon="☷"
            text="Complaints"
            active={activePage === "complaints"}
            onClick={() => setActivePage("complaints")}
          />

          

          <SidebarButton
            icon="▥"
            text="Reports"
            active={activePage === "reports"}
            onClick={() => setActivePage("reports")}
          />

          

         
        </aside>

        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            padding: "40px 30px"
          }}
        >
          {/* DASHBOARD */}
          {activePage === "dashboard" && (
            <>
              <h1 style={{ color: "#183f35" }}>
                Admin Dashboard
              </h1>

              <p style={{ fontSize: "20px", color: "#555" }}>
                Welcome back, Admin
              </p>

              <hr />

              {/* TOTAL */}
              <div
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  padding: "22px",
                  marginTop: "25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "25px"
                }}
              >
                <div style={{ fontSize: "42px" }}>📋</div>

                <div>
                  <h4>Total Complaints</h4>
                  <h1>{complaints.length}</h1>
                </div>
              </div>

              {/* STATS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "25px",
                  marginTop: "28px"
                }}
              >
                <StatCard
                  icon="◷"
                  title="Pending"
                  value={pending}
                  color="#d99000"
                />

                <StatCard
                  icon="⌛"
                  title="In Process"
                  value={processing}
                  color="#1976b9"
                />

                <StatCard
                  icon="✓"
                  title="Completed"
                  value={completed}
                  color="#28723f"
                />
              </div>

              {complaints.length === 0 && !loading && (
                <div
                  style={{
                    marginTop: "30px",
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    padding: "70px",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "80px" }}>📋</div>
                  <h2>No Complaints Found</h2>
                  <p>There are no complaints to display.</p>
                </div>
              )}

              {loading && (
                <h4 style={{ textAlign: "center", marginTop: "40px" }}>
                  Loading complaints...
                </h4>
              )}
            </>
          )}

          {/* COMPLAINTS PAGE */}
          {activePage === "complaints" && (
            <>
              <h1>Complaints</h1>
              <hr />

              {loading ? (
                <h4 style={{ textAlign: "center", marginTop: "40px" }}>
                  Loading complaints...
                </h4>
              ) : complaints.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: "12px"
                  }}
                >
                  <h3>No Complaints Found</h3>
                </div>
              ) : (
                complaints.map((c) => (
                  <div
                    key={c._id}
                    className="card shadow mb-4"
                  >
                    <div className="card-body">
                      <h3>{c.animal}</h3>

                      <p><b>Condition:</b> {c.condition}</p>
                      <p><b>Name:</b> {c.name}</p>
                      <p><b>Mobile:</b> {c.mobile}</p>
                      <p><b>Email:</b> {c.email}</p>
                      <p><b>Area:</b> {c.area}</p>
                      <p><b>Description:</b> {c.description}</p>

                      {c.photo && (
                        <img
                          src={`${API_URL}/uploads/${c.photo}`}
                          alt="animal"
                          className="img-fluid rounded mb-3"
                          style={{
                            maxHeight: "300px"
                          }}
                        />
                      )}

                      <br />

                      <a
                        href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary me-2"
                      >
                        📍 View Location
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success me-2"
                      >
                        🚗 Navigate
                      </a>

                      <p className="mt-3">
                        <b>Status:</b> {c.status}
                      </p>

                      <button
                        className="btn btn-warning me-2"
                        onClick={() =>
                          updateStatus(c._id, "In Process")
                        }
                      >
                        In Process
                      </button>

                      <button
                        className="btn btn-success me-2"
                        onClick={() =>
                          updateStatus(c._id, "Completed")
                        }
                      >
                        Completed
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => deleteComplaint(c._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* ADD COMPLAINT */}
          {activePage === "add" && (
            <div>
              <h1>Add Complaint</h1>
              <p>
                Use the Report Animal page to create a new complaint.
              </p>
            </div>
          )}

          {/* REPORTS */}
          {activePage === "reports" && (
            <div>
              <h1>Reports</h1>

              <div className="card p-4 mt-4">
                <h4>Complaint Summary</h4>

                <p>Total Complaints: {complaints.length}</p>
                <p>Pending: {pending}</p>
                <p>In Process: {processing}</p>
                <p>Completed: {completed}</p>
              </div>
            </div>
          )}

          {/* USERS */}
          {activePage === "users" && (
            <div>
              <h1>Users</h1>
              <p>User management will be available here.</p>
            </div>
          )}

          {/* SETTINGS */}
          {activePage === "settings" && (
            <div>
              <h1>Settings</h1>
              <p>System settings will be available here.</p>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER INFO */}
      <div
        style={{
          background: "rgba(255,255,255,0.8)",
          padding: "22px",
          display: "flex",
          justifyContent: "space-around",
          borderTop: "1px solid #ccc"
        }}
      >
        <div>
          🛡️ <b>Secure System</b>
          <br />
          <small>Your data is safe with us</small>
        </div>

        <div>
          ⏱️ <b>Quick Response</b>
          <br />
          <small>Timely action for every report</small>
        </div>

        <div>
          👥 <b>Better Service</b>
          <br />
          <small>Committed to animal welfare</small>
        </div>
      </div>

      {/* FINAL FOOTER */}
      <footer
        style={{
          background: "#064b35",
          color: "white",
          textAlign: "center",
          padding: "18px"
        }}
      >
        Be Kind to Animals. They Feel. They Matter. 🐾
      </footer>
    </div>
  );
}

/* SIDEBAR BUTTON */
function SidebarButton({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "16px",
        marginBottom: "10px",
        border: "none",
        borderRadius: "7px",
        background: active ? "#075238" : "transparent",
        color: active ? "white" : "#174b3b",
        fontSize: "17px",
        fontWeight: "600",
        textAlign: "left",
        cursor: "pointer"
      }}
    >
      <span style={{ marginRight: "18px" }}>
        {icon}
      </span>

      {text}
    </button>
  );
}

/* STAT CARD */
function StatCard({ icon, title, value, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.8)",
        borderRadius: "12px",
        padding: "28px",
        textAlign: "center",
        border: `1px solid ${color}`,
        borderBottom: `4px solid ${color}`
      }}
    >
      <div
        style={{
          fontSize: "48px",
          color: color
        }}
      >
        {icon}
      </div>

      <h4>{title}</h4>

      <h1 style={{ color }}>
        {value}
      </h1>
    </div>
  );
}

export default Admin;