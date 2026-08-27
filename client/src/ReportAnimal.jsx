import { useState } from "react";
import axios from "axios";
import "./ReportAnimal.css";

function ReportAnimal({ setPage }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    animal: "",
    condition: "",
    description: "",
    area: "",
  });

  const [photo, setPhoto] = useState(null);

  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        alert("Location captured successfully.");
      },
      () => {
        alert(
          "Please allow location permission to get your current location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const submitComplaint = async () => {
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.email ||
      !formData.animal ||
      !formData.condition ||
      !formData.description ||
      !formData.area
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (!photo) {
      alert("Please select an animal photo.");
      return;
    }

    if (!location.latitude || !location.longitude) {
      alert("Please get your current location.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("mobile", formData.mobile);
      data.append("email", formData.email);
      data.append("animal", formData.animal);
      data.append("condition", formData.condition);
      data.append("description", formData.description);
      data.append("area", formData.area);
      data.append("latitude", location.latitude);
      data.append("longitude", location.longitude);
      data.append("photo", photo);

      const response = await axios.post(
        "https://daims.onrender.com/complaint",
        data
      );

      alert(
        response.data.message || "Complaint submitted successfully."
      );

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        animal: "",
        condition: "",
        description: "",
        area: "",
      });

      setPhoto(null);

      setLocation({
        latitude: "",
        longitude: "",
      });

      // Reset file input
      const fileInput = document.getElementById("animalPhoto");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message || "Error submitting complaint."
        );
      } else {
        alert("Server Error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">

      {/* HEADER */}
      <header className="report-header">
        <div className="header-content">

          <div className="paw-icon">
            🐾
          </div>

          <div>
            <h1>Animal Complaint </h1>
            <p>
              Dead and Injured Animal Management System
            </p>
          </div>

          <div className="animal-logo">
            🐄
            <span>CARE • PROTECT • SERVE</span>
          </div>

        </div>
      </header>

      {/* YELLOW LINE */}
      <div className="yellow-line"></div>

      {/* BACK BUTTON */}
      <div className="back-container">
        <button
          className="back-btn"
          onClick={() => setPage("home")}
        >
          ← &nbsp; Back
        </button>
      </div>

      {/* FORM */}
      <main className="report-container">

        <div className="report-card">

          <div className="form-title">
            <h2>Report Animal</h2>
            <div className="title-line"></div>
          </div>

          {/* NAME */}
          <div className="input-group-custom">
            <span className="input-icon">👤</span>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* MOBILE */}
          <div className="input-group-custom">
            <span className="input-icon">📞</span>

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="input-group-custom">
            <span className="input-icon">✉️</span>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* ANIMAL */}
          <div className="input-group-custom">
            <span className="input-icon">🐾</span>

            <input
              type="text"
              name="animal"
              placeholder="Animal Name"
              value={formData.animal}
              onChange={handleChange}
            />
          </div>

          {/* CONDITION */}
          <div className="condition-container">

            <label className="condition-option">
              <input
                type="radio"
                name="condition"
                value="Dead"
                checked={formData.condition === "Dead"}
                onChange={handleChange}
              />

              <span>☠️</span>
              Dead
            </label>

            <label className="condition-option">
              <input
                type="radio"
                name="condition"
                value="Injured"
                checked={formData.condition === "Injured"}
                onChange={handleChange}
              />

              <span>🩹</span>
              Injured
            </label>

          </div>

          {/* DESCRIPTION */}
          <div className="textarea-group">

            <span className="textarea-icon">
              📋
            </span>

            <textarea
              name="description"
              rows="5"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          {/* AREA */}
          <div className="input-group-custom">

            <span className="input-icon">
              📍
            </span>

            <input
              type="text"
              name="area"
              placeholder="Area or District or City or Village"
              value={formData.area}
              onChange={handleChange}
            />

          </div>

          {/* PHOTO */}
          <div className="file-group">

            <span className="input-icon">
              📎
            </span>

            <input
              id="animalPhoto"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) =>
                setPhoto(e.target.files[0])
              }
            />

          </div>

          {/* LOCATION */}
          <button
            className="location-btn"
            onClick={getLocation}
          >
            📍 &nbsp; Get Current Location
          </button>

          <div className="coordinates">

            <p>
              <b>Latitude:</b>{" "}
              {location.latitude || ""}
            </p>

            <p>
              <b>Longitude:</b>{" "}
              {location.longitude || ""}
            </p>

          </div>

          {/* SUBMIT */}
          <button
            className="submit-btn"
            onClick={submitComplaint}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "➤  Submit Complaint"}
          </button>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="report-footer">
        <div>
          <i>
            Be Kind to Animals. They Feel. They Matter.
          </i>
        </div>

        <span>🐾</span>
      </footer>

    </div>
  );
}

export default ReportAnimal;