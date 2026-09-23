import { useEffect, useState } from "react";

import ReportAnimal from "./ReportAnimal";
import AdminRegister from "./AdminRegister";
import AdminLogin from "./AdminLogin";
import Admin from "./Admin";

function App() {
  // Get current page from URL
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

  // Browser / Mobile Back Button
  useEffect(() => {
    const handleBackButton = () => {
      setPage(getPageFromHash());
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  // Navigate between pages
  const navigate = (nextPage) => {
    window.history.pushState(
      { page: nextPage },
      "",
      `#${nextPage}`
    );

    setPage(nextPage);
  };

  // Report Page
  if (page === "report") {
    return <ReportAnimal setPage={navigate} />;
  }

  // Admin Registration Page
  if (page === "register") {
    return <AdminRegister setPage={navigate} />;
  }

  // Admin Login Page
  if (page === "login") {
    return (
      <AdminLogin
        setPage={navigate}
        onLogin={() => navigate("admin")}
      />
    );
  }

  // Admin Dashboard
  if (page === "admin") {
    return (
      <Admin
        onLogout={() => navigate("home")}
      />
    );
  }

  // Language Translations
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
        width: "100%",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/animal-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* ================= NAVBAR ================= */}

      <nav
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.96)",
          padding: "12px clamp(10px, 4vw, 25px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}

        <div
          style={{
            fontWeight: "bold",
            fontSize: "clamp(18px, 3vw, 22px)",
            color: "#1b5e20",
          }}
        >
          🐾 DAIMS
        </div>

        {/* Right Side */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {/* Language */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#555",
                marginRight: "3px",
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
                padding: "6px 9px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "12px",
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
                padding: "6px 9px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "12px",
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
                padding: "6px 9px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              हिन्दी
            </button>
          </div>

          {/* Admin Registration */}

          <button
            onClick={() => navigate("register")}
            style={{
              border: "none",
              background: "transparent",
              color: "#1b5e20",
              fontSize: "clamp(11px, 2vw, 14px)",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "500",
              padding: "5px",
            }}
          >
            {text.register}
          </button>

          {/* Admin Login */}

          <button
            onClick={() => navigate("login")}
            style={{
              border: "none",
              background: "transparent",
              color: "#1b5e20",
              fontSize: "clamp(11px, 2vw, 14px)",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "500",
              padding: "5px",
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
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "clamp(20px, 5vw, 40px) 12px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.94)",
            borderRadius: "18px",
            padding:
              "clamp(20px, 5vw, 45px) clamp(15px, 5vw, 30px)",
            textAlign: "center",
            boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
          }}
        >
          {/* Icon */}

          <div
            style={{
              fontSize: "clamp(40px, 8vw, 60px)",
              marginBottom: "10px",
            }}
          >
            🐾
          </div>

          {/* Title */}

          <h1
            style={{
              color: "#1b5e20",
              fontSize: "clamp(22px, 4vw, 32px)",
              lineHeight: "1.3",
              margin: "0 0 15px",
              fontWeight: "700",
              overflowWrap: "break-word",
            }}
          >
            {text.title}
          </h1>

          {/* Subtitle */}

          <p
            style={{
              color: "#555",
              fontSize: "clamp(14px, 2vw, 17px)",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            {text.subtitle}
          </p>

          {/* Report Button */}

          <button
            onClick={() => navigate("report")}
            style={{
              width: "100%",
              maxWidth: "300px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "14px 20px",
              fontSize: "clamp(15px, 3vw, 19px)",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
            }}
          >
            📝 {text.report}
          </button>
        </div>
      </main>

      {/* ================= FOOTER ================= */}

      <footer
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.75)",
          color: "white",
          textAlign: "center",
          padding: "15px 10px",
          fontSize: "clamp(11px, 2vw, 14px)",
          lineHeight: "1.5",
          boxSizing: "border-box",
        }}
      >
        © {new Date().getFullYear()} DAIMS - Dead & Injured Animal
        Management System
      </footer>
    </div>
  );
}

export default App;