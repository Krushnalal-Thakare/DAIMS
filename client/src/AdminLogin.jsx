import { useState } from "react";
import axios from "axios";
import Admin from "./Admin";

function AdminLogin({ setPage }) {

  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  };

  const loginAdmin = async () => {

    try {

      const res = await axios.post(
        "https://daims.onrender.com/admin/login",
        login
      );

      if (res.data.success) {
         localStorage.setItem(
    "adminArea",
    res.data.admin.area
  );

        alert("Login Successful");
        setLoggedIn(true);

      } else {

        alert("Invalid Username or Password");

      }

    } catch (error) {

      console.log(error);
      alert("Server Error");

    }

  };

  const logout = () => {
    setLoggedIn(false);
  };

  if (loggedIn) {
    return <Admin onLogout={logout} />;
  }

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "100px"
      }}
    >
      <div className="text-start">

<button
  className="btn btn-secondary mb-3"
  onClick={() => setPage("home")}
>
  ⬅Back
</button>
  </div>
      <h1>🔐 Admin Login</h1>
      

      <br />

      <input
        type="text"
        name="username"
        placeholder="Username"
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

      <button onClick={loginAdmin}>
        Login
      </button>

    </div>
  );
}

export default AdminLogin;