import { useState } from "react";
import axios from "axios";

function AdminRegister({ setPage }) {

  const [admin, setAdmin] = useState({
    organization: "",
    username: "",
    address: "",
    area:"",
    email: "",
    purpose: "",
    password: ""
  });

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value
    });
  };

  const registerAdmin = async () => {

    const res = await axios.post(
      "https://daims.onrender.com/admin/register",
      admin
    );

    alert(res.data.message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="text-start">

 <button
  className="btn btn-secondary mb-3"
  onClick={() => setPage("home")}
>
  ⬅ Back
</button>
  </div>
      <h1>Admin Registration</h1>
      

      <input
        name="organization"
        placeholder="Organization Name"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="address"
        placeholder="Address"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br />
      <br />

      <input
  name="area"
  placeholder="Area"
  onChange={handleChange}
/>

      <br /><br />

      <input
        name="purpose"
        placeholder="Purpose"
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={registerAdmin}>
        Register
      </button>

    </div>
  );
}

export default AdminRegister;