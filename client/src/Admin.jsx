import { useEffect, useState } from "react";
import axios from "axios";

function Admin({ onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const area = localStorage.getItem("adminArea");

      if (!area) {
        alert("Admin Area Not Found");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://daims.onrender.com/complaints/${area}`
      );

      setComplaints(res.data);

    } catch (error) {
      console.log("Fetch Complaints Error:", error);

      if (error.response) {
        alert(error.response.data.message || "Error Fetching Complaints");
      } else {
        alert("Server Error");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `https://daims.onrender.com/complaint/${id}`,
        { status: status }
      );

      alert(response.data.message);
      fetchComplaints();

    } catch (error) {
      console.log("Status Update Error:", error);

      if (error.response) {
        alert(error.response.data.message || "Error Updating Status");
      } else {
        alert("Server Error");
      }
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://daims.onrender.com/complaint/${id}`
      );

      alert(response.data.message);
      fetchComplaints();

    } catch (error) {
      console.log("Delete Complaint Error:", error);

      if (error.response) {
        alert(error.response.data.message || "Error Deleting Complaint");
      } else {
        alert("Server Error");
      }
    }
  };

  const pending = complaints.filter((c) => c.status === "Pending").length;
  const processing = complaints.filter((c) => c.status === "In Process").length;
  const completed = complaints.filter((c) => c.status === "Completed").length;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3 mb-3">
        <h3 className="mb-0">Admin Dashboard</h3>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="container">
        <h3 className="mb-4">Total Complaints: {complaints.length}</h3>

        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-warning text-white shadow">
              <div className="card-body">
                <h4>Pending</h4>
                <h2>{pending}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-info text-white shadow">
              <div className="card-body">
                <h4>In Process</h4>
                <h2>{processing}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white shadow">
              <div className="card-body">
                <h4>Completed</h4>
                <h2>{completed}</h2>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info text-center">
            Loading Complaints...
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="alert alert-secondary text-center">
            No Complaints Found
          </div>
        )}

        {!loading &&
          complaints.map((c) => (
            <div key={c._id} className="card shadow mb-4">
              <div className="card-body">
                <h3 className="card-title">🐾 {c.animal}</h3>
                <hr />
                <p><b>Name:</b> {c.name}</p>
                <p><b>Mobile:</b> {c.mobile}</p>
                <p><b>Email:</b> {c.email}</p>
                <p><b>Area:</b> {c.area}</p>
                <p><b>Description:</b> {c.description}</p>

                {c.photo && (
                  <div className="mb-3">
                    <img
                      src={`https://daims.onrender.com/uploads/${c.photo}`}
                      alt="Reported animal"
                      className="img-fluid rounded"
                      style={{
                        maxHeight: "300px",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <a
                    href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary me-2 mb-2"
                  >
                    📍 View Location
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success mb-2"
                  >
                    🚗 Navigate
                  </a>
                </div>

                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={
                      c.status === "Completed"
                        ? "badge bg-success"
                        : c.status === "In Process"
                        ? "badge bg-info"
                        : "badge bg-warning text-dark"
                    }
                  >
                    {c.status || "Pending"}
                  </span>
                </p>

                <button
                  className="btn btn-warning me-2 mb-2"
                  onClick={() => updateStatus(c._id, "In Process")}
                >
                  🔄 In Process
                </button>

                <button
                  className="btn btn-success me-2 mb-2"
                  onClick={() => updateStatus(c._id, "Completed")}
                >
                  ✅ Completed
                </button>

                <button
                  className="btn btn-danger mb-2"
                  onClick={() => deleteComplaint(c._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default Admin;
