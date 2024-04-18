const mongoose = require("mongoose");

const authAdmin = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role:{type:String,default:"Admin"},
    password: { type: String, required: true },
    image:{type: String, required: true}
  },
  {
    collection: "Admin",
  }
);

const model = mongoose.model("Admin", authAdmin);

module.exports = model;
