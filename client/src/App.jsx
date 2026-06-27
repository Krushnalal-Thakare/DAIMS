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
      adminLogin: "Admin Login"
    },
    mr: {
      title: "मृत व जखमी प्राणी व्यवस्थापन प्रणाली",
      report: "प्राणी रिपोर्ट करा",
      adminReg: "प्रशासक नोंदणी",
      adminLogin: "प्रशासक लॉगिन"
    },
    hi: {
      title: "मृत और घायल पशु प्रबंधन प्रणाली",
      report: "जानवर रिपोर्ट करें",
      adminReg: "एडमिन रजिस्ट्रेशन",
      adminLogin: "एडमिन लॉगिन"
    }
  };

  if (page === "report") return <ReportAnimal setPage={setPage} />;
  if (page === "register") return <AdminRegister setPage={setPage} />;
  if (page === "login") return <AdminLogin setPage={setPage} onLogin={() => setPage("admin")} />;
  if (page === "admin") return <Admin onLogout={() => setPage("home")} />;

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-3">
        <span className="navbar-brand">🐾 DAIMS</span>

        <div>
          <button className="btn btn-light btn-sm me-2" onClick={() => setLang("en")}>EN</button>
          <button className="btn btn-light btn-sm me-2" onClick={() => setLang("mr")}>MR</button>
          <button className="btn btn-light btn-sm" onClick={() => setLang("hi")}>HI</button>
        </div>
      </nav>

      {/* HOME */}
      <div className="container d-flex justify-content-center align-items-center" style={{height:"90vh"}}>

        <div className="card shadow-lg p-5 text-center" style={{width:"600px"}}>

          <h1>🐾 DAIMS</h1>

          <h4 className="mb-3">
            {text[lang].title}
          </h4>

          <button className="btn btn-success m-2" onClick={() => setPage("report")}>
            {text[lang].report}
          </button>

          <button className="btn btn-dark m-2" onClick={() => setPage("register")}>
            {text[lang].adminReg}
          </button>

          <button className="btn btn-primary m-2" onClick={() => setPage("login")}>
            {text[lang].adminLogin}
          </button>

        </div>

      </div>

      <footer className="bg-dark text-white text-center p-2">
        © 2026 DAIMS System By krushnalal
      </footer>
    </>
  );
}

export default App;