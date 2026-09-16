import { useEffect, useState } from "react";
import ReportAnimal from "./ReportAnimal";
import AdminRegister from "./AdminRegister";
import AdminLogin from "./AdminLogin";
import Admin from "./Admin";

function App() {
 
  const getPageFromHash = () => {
    const hash = window.location.hash.replace("#", "");

    const validPages = [
      "home",
      "report",
      "register",
      "login",
      "admin",
    ];

    return validPages.includes(hash) ? hash : "home";
  };

  const [page, setPage] = useState(getPageFromHash);

  const [lang, setLang] = useState("en");

  // Browser / Mobile Back button
  useEffect(() => {
    const handleBackButton = () => {
      setPage(getPageFromHash());
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  // Page change function
  const navigate = (nextPage) => {
    window.history.pushState(
      { page: nextPage },
      "",
      `#${nextPage}`
    );

    setPage(nextPage);
  };

  // -----------------------------
  // REPORT PAGE
  // -----------------------------
  if (page === "report") {
    return <ReportAnimal setPage={navigate} />;
  }

  // -----------------------------
  // ADMIN REGISTER PAGE
  // -----------------------------
  if (page === "register") {
    return <AdminRegister setPage={navigate} />;
  }

  // -----------------------------
  // ADMIN LOGIN PAGE
  // -----------------------------
  if (page === "login") {
    return (
      <AdminLogin
        setPage={navigate}
        onLogin={() => navigate("admin")}
      />
    );
  }

  // -----------------------------
  // ADMIN DASHBOARD
  // -----------------------------
  if (page === "admin") {
    return (
      <Admin
        onLogout={() => navigate("home")}
      />
    );
  }

  // -----------------------------
  // HOME PAGE
  // -----------------------------

  const translations = {
    en: {
      title: "Dead & Injured Animal Management System",
      subtitle:
        "Report dead or injured animals and help authorities take quick action.",
      report: "Report Animal",
      register: "Admin Registration",
      login: "Admin Login",
      selectLanguage: "Language",
    },

    mr: {
      title: "मृत व जखमी प्राणी व्यवस्थापन प्रणाली",
      subtitle:
        "मृत किंवा जखमी प्राण्यांची माहिती द्या आणि प्रशासनाला त्वरित मदत करण्यास सहकार्य करा.",
      report: "प्राण्याची तक्रार करा",
      register: "प्रशासक नोंदणी",
      login: "प्रशासक लॉगिन",
      selectLanguage: "भाषा",
    },

    hi: {
      title: "मृत एवं घायल पशु प्रबंधन प्रणाली",
      subtitle:
        "मृत या घायल पशुओं की जानकारी दें और प्रशासन को तुरंत कार्रवाई करने में मदद करें।",
      report: "पशु की शिकायत करें",
      register: "एडमिन पंजीकरण",
      login: "एडमिन लॉगिन",
      selectLanguage: "भाषा",
    },
  };

  const text = translations[lang];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/animal-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.96)",
          padding: "12px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* LOGO / NAME */}
        <div
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            color: "#1b5e20",
          }}
        >
          🐾 DAIMS
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {/* LANGUAGE */}
          <div>
            <span
              style={{
                fontSize: "13px",
                marginRight: "5px",
                color: "#555",
              }}
            >
              {text.selectLanguage}:
            </span>

            <button
              onClick={() => setLang("en")}
              style={{
                border: "none",
                background: lang === "en" ? "#2e7d32" : "#eee",
                color: lang === "en" ? "white" : "#333",
                padding: "5px 9px",
                borderRadius: "5px",
                marginRight: "3px",
                cursor: "pointer",
              }}
            >
              English
            </button>

            <button
              onClick={() => setLang("mr")}
              style={{
                border: "none",
                background: lang === "mr" ? "#2e7d32" : "#eee",
                color: lang === "mr" ? "white" : "#333",
                padding: "5px 9px",
                borderRadius: "5px",
                marginRight: "3px",
                cursor: "pointer",
              }}
            >
              मराठी
            </button>

            <button
              onClick={() => setLang("hi")}
              style={{
                border: "none",
                background: lang === "hi" ? "#2e7d32" : "#eee",
                color: lang === "hi" ? "white" : "#333",
                padding: "5px 9px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
             हिन्दी
            </button>
          </div>

          {/* ADMIN REGISTRATION */}
          <button
            onClick={() => navigate("register")}
            style={{
              border: "none",
              background: "transparent",
              color: "#1b5e20",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            {text.register}
          </button>

          {/* ADMIN LOGIN */}
          <button
            onClick={() => navigate("login")}
            style={{
              border: "none",
              background: "transparent",
              color: "#1b5e20",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            {text.login}
          </button>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            background: "rgba(255,255,255,0.94)",
            borderRadius: "18px",
            padding: "45px 30px",
            textAlign: "center",
            boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
          }}
        >
          {/* ICON */}
          <div
            style={{
              fontSize: "60px",
              marginBottom: "10px",
            }}
          >
            🐾
          </div>

          {/* TITLE */}
          <h1
            style={{
              color: "#1b5e20",
              fontSize: "32px",
              marginBottom: "15px",
              fontWeight: "700",
            }}
          >
            {text.title}
          </h1>

          {/* SUBTITLE */}
          <p
            style={{
              color: "#555",
              fontSize: "17px",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            {text.subtitle}
          </p>

          {/* REPORT BUTTON */}
          <button
            onClick={() => navigate("report")}
            style={{
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "15px 45px",
              fontSize: "19px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
              transition: "0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#1b5e20";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#2e7d32";
            }}
          >
            📝 {text.report}
          </button>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          background: "rgba(0,0,0,0.75)",
          color: "white",
          textAlign: "center",
          padding: "15px",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} DAIMS - Dead & Injured Animal
        Management System
      </footer>
    </div>
  );
}

export default App;