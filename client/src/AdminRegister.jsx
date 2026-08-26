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
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const registerAdmin = async () => {
    try {
      const response = await axios.post(
        "https://daims.onrender.com/admin/register",
        formData
      );

      alert(response.data.message);

      if (response.data.success) {
        setPage("login");
      }

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <div className="container mt-4">

      <button
        className="btn btn-secondary mb-3"
        onClick={() => setPage("home")}
      >
        ⬅ Back
      </button>

      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>

        <h2 className="text-center mb-4">
          Admin Registration
        </h2>

        <input
          className="form-control mb-3"
          name="organization"
          placeholder="Organization"
          value={formData.organization}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="area"
          placeholder="Area"
          value={formData.area}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="purpose"
          placeholder="Purpose"
          value={formData.purpose}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          className="btn btn-success w-100"
          onClick={registerAdmin}
        >
          Register Admin
        </button>

      </div>
    </div>
  );
}

export default AdminRegister;