import { useState } from "react";
import ReportAnimal from "./ReportAnimal";
import AdminRegister from "./AdminRegister";
import AdminLogin from "./AdminLogin";
import Admin from "./Admin";


function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("en");

  const text = {
    en: {
      title: "Dead & Injured Animal Management System",
      report: "Report Animal",
      adminReg: "Admin Registration",
      adminLogin: "Admin Login",
    },

    mr: {
      title: "मृत व जखमी प्राणी व्यवस्थापन प्रणाली",
      report: "प्राणी रिपोर्ट करा",
      adminReg: "प्रशासक नोंदणी",
      adminLogin: "प्रशासक लॉगिन",
    },

    hi: {
      title: "मृत और घायल पशु प्रबंधन प्रणाली",
      report: "जानवर रिपोर्ट करें",
      adminReg: "एडमिन रजिस्ट्रेशन",
      adminLogin: "एडमिन लॉगिन",
    },
  };

  // Pages
  if (page === "report") {
    return <ReportAnimal setPage={setPage} />;
  }

  if (page === "register") {
    return <AdminRegister setPage={setPage} />;
  }

  if (page === "login") {
    return (
      <AdminLogin
        setPage={setPage}
        onLogin={() => setPage("admin")}
      />
    );
  }

  if (page === "admin") {
    return <Admin onLogout={() => setPage("home")} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/animal-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
     <nav className="navbar navbar-dark bg-dark px-3">
  <span className="navbar-brand fw-bold">
    🐾 DAIMS
  </span>

  <div className="d-flex align-items-center flex-wrap gap-2">

    <button
      type="button"
      className="btn btn-link text-white p-1"
      style={{
        fontSize: "12px",
        textDecoration: "none",
        position: "relative",
        zIndex: 20,
      }}
      onClick={() => {
        console.log("Admin Registration clicked");
        setPage("register");
      }}
    >
      Admin Registration
    </button>

    <button
      type="button"
      className="btn btn-link text-white p-1"
      style={{
        fontSize: "12px",
        textDecoration: "none",
        position: "relative",
        zIndex: 20,
      }}
      onClick={() => {
        console.log("Admin Login clicked");
        setPage("login");
      }}
    >
      Admin Login
    </button>

    <button
      type="button"
      className="btn btn-light btn-sm"
      onClick={() => setLang("en")}
    >
      EN
    </button>

    <button
      type="button"
      className="btn btn-light btn-sm"
      onClick={() => setLang("mr")}
    >
      MR
    </button>

    <button
      type="button"
      className="btn btn-light btn-sm"
      onClick={() => setLang("hi")}
    >
      HI
    </button>

  </div>
</nav>
      {/* HOME */}
<div
  className="container-fluid d-flex justify-content-center align-items-center px-3"
  style={{
    flex: 1,
    minHeight: "80vh",
  }}
>
  <div
    className="card shadow-lg p-4 p-md-5 text-center"
    style={{
      width: "100%",
      maxWidth: "600px",
      backgroundColor: "rgba(255,255,255,0.90)",
      borderRadius: "20px",
      position: "relative",
      zIndex: 10,
    }}
  >
    <h1 className="mb-3">
      🐾 DAIMS
    </h1>

    <h4 className="mb-4">
      {text[lang].title}
    </h4>

    {/* REPORT BUTTON */}
    <button
      type="button"
      className="btn btn-success w-100 mb-3"
      onClick={() => {
        console.log("Report clicked");
        setPage("report");
      }}
    >
      🐾 {text[lang].report}
    </button>

  </div>
</div>
      {/* FOOTER */}

      <footer className="bg-dark text-white text-center p-2">
        © 2026 DAIMS System By Krushnalal Thakare
      </footer>

    </div>
  );
}

export default App;