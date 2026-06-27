const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  organization: String,
  username: String,
  address: String,
  area:String,
  email: String,
  purpose: String,
  password: String
});

module.exports = mongoose.model("Admin", adminSchema);