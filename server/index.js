const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Complaint = require("./models/Complaint");
const Admin = require("./models/Admin");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ==========================
// MongoDB
// ==========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

// ==========================
// Email
// ==========================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email Configuration Error:", error);
  } else {
    console.log("✅ Email Server Ready");
  }
});
// ==========================
// Multer
// ==========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ==========================
// Home
// ==========================

app.get("/", (req, res) => {
  res.send("DAIMS Server Running");
});

// ==========================
// Admin Register
// ==========================

app.post("/admin/register", async (req, res) => {
  try {
    const exist = await Admin.findOne({
      username: req.body.username,
    });

    if (exist) {
      return res.json({
        success: false,
        message: "Username Already Exists",
      });
    }

    const admin = new Admin(req.body);

    await admin.save();

    res.json({
      success: true,
      message: "Admin Registered Successfully",
    });
  } catch (err) {
    console.log("Register Error:", err);

    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
});

// ==========================
// Admin Login
// ==========================

app.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (admin) {
      res.json({
        success: true,
        message: "Login Successful",
        admin: admin,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Username or Password",
      });
    }
  } catch (err) {
    console.log("Login Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ==========================
// Save Complaint
// ==========================

app.post(
  "/complaint",
  upload.single("photo"),
  async (req, res) => {
    try {
      const complaint = new Complaint({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        animal: req.body.animal,
        condition: req.body.condition,
        description: req.body.description,
        area: req.body.area,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        photo: req.file ? req.file.filename : "",
      });

      await complaint.save();

      console.log("Complaint Saved");
      console.log("Complaint Area:", req.body.area);

      // Find admin from same area
      const admin = await Admin.findOne({
        area: req.body.area,
      });

      console.log("Admin Found:", admin);

      if (admin && admin.email) {
        try {
          console.log("Sending Email To:", admin.email);

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: "New Animal Complaint",

            text: `
New Animal Complaint

Area: ${req.body.area}

Animal: ${req.body.animal}

Reporter: ${req.body.name}

Mobile: ${req.body.mobile}

Email: ${req.body.email}

Description:

${req.body.description}

Location:

https://www.google.com/maps?q=${req.body.latitude},${req.body.longitude}
`,
          });

          console.log("Admin Email Sent Successfully");
        } catch (emailError) {
          console.log("Admin Email Error:", emailError);
        }
      } else {
        console.log("No Admin Found For This Area");
      }

      res.json({
        success: true,
        message: "Complaint Saved Successfully",
      });
    } catch (err) {
      console.log("Complaint Error:", err);

      res.status(500).json({
        success: false,
        message: "Error Saving Complaint",
      });
    }
  }
);

// ==========================
// Get Complaints By Area
// ==========================

app.get("/complaints/:area", async (req, res) => {
  try {
    const complaints = await Complaint.find({
      area: req.params.area,
    });

    res.json(complaints);
  } catch (err) {
    console.log("Fetch Complaints Error:", err);

    res.status(500).json({
      message: "Error Fetching Complaints",
    });
  }
});

// ==========================
// DELETE COMPLAINT
// ==========================

app.delete("/complaint/:id", async (req, res) => {
  try {
    console.log("DELETE REQUEST:", req.params.id);

    const complaint = await Complaint.findByIdAndDelete(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint Not Found",
      });
    }

    console.log("Complaint Deleted:", complaint._id);

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

// ==========================
// Update Complaint Status
// ==========================

app.put("/complaint/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint Not Found",
      });
    }

    // Send email to reporter when completed
    if (
      req.body.status === "Completed" &&
      complaint.email
    ) {
      try {
        console.log(
          "Sending completion mail to:",
          complaint.email
        );

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: complaint.email,
          subject: "Animal Complaint Completed",

          text: `
Dear ${complaint.name},

Thank you for reporting the animal.

Your complaint has been completed successfully.

Animal: ${complaint.animal}

Status: Completed

DAIMS Team
`,
        });

        console.log("Completion Email Sent Successfully");
      } catch (emailError) {
        console.log(
          "Completion Email Error:",
          emailError
        );
      }
    }

    res.json({
      success: true,
      message: "Status Updated Successfully",
    });
  } catch (err) {
    console.log("Status Update Error:", err);

    res.status(500).json({
      success: false,
      message: "Error Updating Status",
    });
  }
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});