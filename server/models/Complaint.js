const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  animal: String,
  description: String,

  latitude: String,
  longitude: String,
  area:String,
  photo: String,
  email: String,
  
  condition: {
  type: String,
  enum: ["Dead", "Injured"],
  required: true
},

  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);