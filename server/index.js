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

/* ==========================
   MongoDB
========================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ==========================
   Email
========================== */


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* ==========================
   Multer
========================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ==========================
   Home
========================== */

app.get("/", (req, res) => {
  res.send("DAIMS Server Running");
});

/* ==========================
   Admin Register
========================== */

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
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
});

/* ==========================
   Admin Login
========================== */

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
        admin:admin
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Username or Password",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* ==========================
   Save Complaint
========================== */

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
        description: req.body.description,

        area: req.body.area,

        latitude: req.body.latitude,
        longitude: req.body.longitude,

        photo: req.file ? req.file.filename : "",
      });

      await complaint.save();

      // Find Admin of Same Area

      const admin = await Admin.findOne({
        area: req.body.area,
      });

      if (admin) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: admin.email,

          subject: "New Animal Complaint",

          text: `
New Animal Complaint

Area : ${req.body.area}

Animal : ${req.body.animal}

Reporter : ${req.body.name}

Mobile : ${req.body.mobile}

Email : ${req.body.email}

Description :

${req.body.description}

Location :

https://www.google.com/maps?q=${req.body.latitude},${req.body.longitude}
`,
        });
      }

      res.json({
        success: true,
        message: "Complaint Saved Successfully",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Error Saving Complaint",
      });
    }
  }
);
/* ==========================
   Get All Complaints
========================== */

app.get("/complaints/:area", async (req, res) => {
  try {
    const complaints = await Complaint.find({
    area: req.params.area
  });

    res.json(complaints);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error Fetching Complaints",
    });
  }
});

/* ==========================
   Update Complaint Status
========================== */

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
        message: "Complaint Not Found",
      });
    }

    // Reporter ला Email
    
    if (req.body.status === "Completed" && complaint.email) {

  console.log("Sending mail to:", complaint.email);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: complaint.email,
    subject: "Animal Complaint Completed",
    text: `
Dear ${complaint.name},

Thank you for reporting the animal.

Your complaint has been completed successfully.

Animal : ${complaint.animal}

Status : Completed

DAIMS Team
`
  });

  console.log("Mail Sent Successfully");
  console.log(info);
}

    res.json({
      success: true,
      message: "Status Updated Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error Updating Status",
    });
  }
});

/* ==========================
   Start Server
========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});