import { useState } from "react";
import axios from "axios";


function ReportAnimal({ setPage }) {



  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    area: "",
    animal: "",
    description: ""
  });

  const [photo, setPhoto] = useState(null);

  const [location, setLocation] = useState({
    latitude: "",
    longitude: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

      },

      () => {
        alert("Please Allow Location Permission");
      }

    );

  };

  const submitComplaint = async () => {

    try {

      if (
        !formData.name ||
        !formData.mobile ||
        !formData.email ||
        !formData.area ||
        !formData.animal ||
        !formData.description
      ) {
        alert("Please Fill All Fields");
        return;
      }

      if (!photo) {
        alert("Please Select Photo");
        return;
      }

      if (!location.latitude || !location.longitude) {
        alert("Please Get Your Location");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("mobile", formData.mobile);
      data.append("email", formData.email);
      data.append("area", formData.area);
      data.append("animal", formData.animal);
      data.append("description", formData.description);
      data.append("latitude", location.latitude);
      data.append("longitude", location.longitude);
      data.append("photo", photo);

      const response = await axios.post(
        "https://daims.onrender.com/complaint",
        data
      );

      alert(response.data.message);

      setFormData({
        name: "",
        mobile: "",
        email: "",
        area: "",
        animal: "",
        description: ""
      });

      setPhoto(null);

      setLocation({
        latitude: "",
        longitude: ""
      });

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
    <>
      <div className="alert alert-primary text-center">
        <h2>🐾 Animal Complaint Registration</h2>
      </div>

      <div className="container mt-3">
        <div className="text-start">

          <button
            className="btn btn-secondary mb-3"
            onClick={() => setPage("home")}
          >
            ⬅ Back
          </button>
        </div>

        <div className="card shadow p-4 mt-3">

          <h3 className="text-center mb-4">
            Report Animal
          </h3>

          <input
            className="form-control mb-3"
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

<input
  className="form-control mb-3"
  type="text"
  name="animal"
  placeholder="Animal Name"
  value={formData.animal}
  onChange={handleChange}
/>
<textarea
  className="form-control mb-3"
  rows="4"
  name="description"
  placeholder="Description"
  value={formData.description}
  onChange={handleChange}
/>
          <input
            className="form-control mb-3"
            type="text"
            name="Area"
            placeholder="District OR City/village"
            value={formData.area}
            onChange={handleChange}
          />


          <input
            className="form-control mb-3"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          

          <button
            className="btn btn-warning mb-3"
            onClick={getLocation}
          >
            📍 Get Current Location
          </button>

          <p><b>Latitude:</b> {location.latitude}</p>
          <p><b>Longitude:</b> {location.longitude}</p>

          <button
            className="btn btn-success w-100"
            onClick={submitComplaint}
          >
            Submit Complaint
          </button>

        </div>

      </div>
    </>
  );
}

export default ReportAnimal;