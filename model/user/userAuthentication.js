const mongoose = require("mongoose");

const authUser = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    userImage: { type: String },
    role: {
      type: String, required: true
    },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    jobDescription: { type: String, default: "" },
    isApprove: { type: Boolean },
    date: { type: Date, default: new Date() },
    isPaid: { type: Boolean, default: false },
    plan: { type: String, default: "Free" },
    planStartDate: { type: String, default: "" },
    planEndDate: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    companySize: { type: String, default: "" },
    coverImage: { type: String, default: "" },
  },
  {
    collection: "Users",
  }
);

const model = mongoose.model("Users", authUser);

module.exports = model;
