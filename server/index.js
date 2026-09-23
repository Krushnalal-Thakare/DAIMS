const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const Complaint = require("./models/Complaint");
const Admin = require("./models/Admin");

dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// ===============================
// MULTER
// ===============================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ===============================
// GMAIL SMTP
// ===============================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("❌ Email Configuration Error:", error);
  } else {
    console.log("✅ Gmail Email Server Ready");
  }
});

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DAIMS Backend Running",
  });
});

// ===============================
// ADMIN REGISTER
// ===============================

app.post("/admin/register", async (req, res) => {
  try {
    const {
      organization,
      username,
      address,
      area,
      email,
      purpose,
      password,
    } = req.body;

    const existingAdmin = await Admin.findOne({
      username,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const admin = new Admin({
      organization,
      username,
      address,
      area,
      email,
      purpose,
      password,
    });

    await admin.save();

    res.json({
      success: true,
      message: "Admin Registered Successfully",
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error Registering Admin",
    });
  }
});

// ===============================
// ADMIN LOGIN
// ===============================

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({
      username,
      password,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    res.json({
      success: true,
      message: "Login Successful",
      admin: {
        id: admin._id,
        organization: admin.organization,
        username: admin.username,
        address: admin.address,
        area: admin.area,
        email: admin.email,
        purpose: admin.purpose,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Login Error",
    });
  }
});

// ===============================
// CREATE COMPLAINT
// ===============================

app.post(
  "/complaint",
  upload.single("photo"),
  async (req, res) => {
    try {
      console.log("Complaint Received");

      const {
        name,
        mobile,
        email,
        animal,
        condition,
        description,
        area,
        latitude,
        longitude,
      } = req.body;

      // -------------------------------
      // VALIDATION
      // -------------------------------

      if (
        !name ||
        !mobile ||
        !email ||
        !animal ||
        !condition ||
        !description ||
        !area ||
        !latitude ||
        !longitude
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // -------------------------------
      // PHOTO
      // -------------------------------

      const photo = req.file
        ? `/uploads/${req.file.filename}`
        : "";

      // -------------------------------
      // SAVE COMPLAINT
      // -------------------------------

      const complaint = new Complaint({
        name,
        mobile,
        email,
        animal,
        condition,
        description,
        area,
        latitude,
        longitude,
        photo,
      });

      await complaint.save();

      console.log("Complaint Saved:", complaint._id);

      // -------------------------------
      // FIND ADMIN BY AREA
      // -------------------------------

      const admin = await Admin.findOne({
        area: area,
      });

      if (admin) {
        console.log("Sending Email To:", admin.email);

        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: admin.email,

            subject: "New Animal Complaint - DAIMS",

            html: `
              <h2>New Animal Complaint</h2>

              <p><b>Name:</b> ${name}</p>
              <p><b>Mobile:</b> ${mobile}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Animal:</b> ${animal}</p>
              <p><b>Condition:</b> ${condition}</p>
              <p><b>Area:</b> ${area}</p>

              <p>
                <b>Description:</b><br>
                ${description}
              </p>

              <p>
                <b>Latitude:</b> ${latitude}<br>
                <b>Longitude:</b> ${longitude}
              </p>

              <p>
                Please check the DAIMS Admin Panel.
              </p>
            `,
          });

          console.log("✅ Admin Email Sent");
        } catch (emailError) {
          console.log(
            "❌ Admin Email Error:",
            emailError
          );
        }
      } else {
        console.log(
          "⚠️ No Admin Found For This Area:",
          area
        );
      }

      res.json({
        success: true,
        message: "Complaint Submitted Successfully",
      });
    } catch (err) {
      console.log("COMPLAINT ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Error Submitting Complaint",
      });
    }
  }
);

// ===============================
// GET COMPLAINTS BY AREA
// ===============================

app.get("/complaints/:area", async (req, res) => {
  try {
    const complaints = await Complaint.find({
      area: req.params.area,
    }).sort({
      _id: -1,
    });

    res.json({
      success: true,
      complaints,
    });
  } catch (err) {
    console.log("GET COMPLAINT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error Fetching Complaints",
    });
  }
});

// ===============================
// DELETE COMPLAINT
// ===============================

app.delete("/complaint/:id", async (req, res) => {
  try {
    console.log(
      "DELETE REQUEST:",
      req.params.id
    );

    const complaint =
      await Complaint.findByIdAndDelete(
        req.params.id
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint Not Found",
      });
    }

    console.log(
      "Complaint Deleted:",
      complaint._id
    );

    res.json({
      success: true,
      message: "Complaint Deleted Successfully",
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error Deleting Complaint",
    });
  }
});

// ===============================
// UPDATE COMPLAINT STATUS
// ===============================

app.put("/complaint/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const complaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint Not Found",
      });
    }

    console.log(
      "Complaint Status:",
      status
    );

    // -------------------------------
    // SEND COMPLETION EMAIL
    // -------------------------------

    if (
      status === "Completed" &&
      complaint.email
    ) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: complaint.email,

          subject:
            "DAIMS Complaint Completed",

          html: `
            <h2>Complaint Completed</h2>

            <p>Hello ${complaint.name},</p>

            <p>
              Your animal complaint has been
              successfully completed.
            </p>

            <p>
              <b>Animal:</b> ${complaint.animal}
            </p>

            <p>
              <b>Area:</b> ${complaint.area}
            </p>

            <p>
              Thank you for helping animals.
            </p>

            <p>
              <b>DAIMS Team</b>
            </p>
          `,
        });

        console.log(
          "✅ Completion Email Sent"
        );
      } catch (emailError) {
        console.log(
          "❌ Completion Email Error:",
          emailError
        );
      }
    }

    res.json({
      success: true,
      message: "Complaint Updated Successfully",
      complaint,
    });
  } catch (err) {
    console.log(
      "UPDATE COMPLAINT ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Error Updating Complaint",
    });
  }
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 DAIMS Server Running On Port ${PORT}`
  );
});