import { useEffect, useState } from "react";
import axios from "axios";

function Admin({ onLogout }) {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const area = localStorage.getItem("adminArea");

const res = await axios.get(
  `https://daims.onrender.com/complaints/${area}`
);

setComplaints(res.data);
    setComplaints(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`https://daims.onrender.com/complaint/${id}`, { status });
    fetchComplaints();
  };

  const pending = complaints.filter((c) => c.status === "Pending").length;
  const processing = complaints.filter((c) => c.status === "In Process").length;
  const completed = complaints.filter((c) => c.status === "Completed").length;

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3 mb-3">
        <h3>Admin Dashboard</h3>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <h3>Total Complaints: {complaints.length}</h3>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h4>Pending</h4>
              <h2>{pending}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h4>In Process</h4>
              <h2>{processing}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h4>Completed</h4>
              <h2>{completed}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      {complaints.map((c) => (
        <div key={c._id} className="card shadow mb-4">
          <div className="card-body">
            <h3 className="card-title">{c.animal}</h3>

            <p><b>Name:</b> {c.name}</p>
            <p><b>Mobile:</b> {c.mobile}</p>
            <p><b>Description:</b> {c.description}</p>

            {c.photo && (
              <img
                src={`https://daims.onrender.com/uploads/${c.photo}`}
                alt="animal"
                className="img-fluid rounded"
                style={{ maxHeight: "300px" }}
              />
            )}

            <br /><br />

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
              className="btn btn-success"
            >
              🚗 Navigate
            </a>

            <br /><br />

            <p><b>Status:</b> {c.status}</p>

            <button
              className="btn btn-warning me-2"
              onClick={() => updateStatus(c._id, "In Process")}
            >
              In Process
            </button>

            <button
              className="btn btn-success"
              onClick={() => updateStatus(c._id, "Completed")}
            >
              Completed
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default Admin;
