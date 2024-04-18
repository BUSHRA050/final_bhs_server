const mongoose = require("mongoose");

const authOrginization = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "Orginization" },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    orginizationImage: { type: String },
    isApprove: { type: Boolean, default: false },
    date: { type: Date, default: new Date() },
    isPaid: { type: Boolean, default: false },
    plan: { type: String, default: "Free" },
    planStartDate: { type: String, default: "" },
    planEndDate: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false }
  },
  {
    collection: "Orginizations",
  }
);

const model = mongoose.model("Orginizations", authOrginization);

module.exports = model;
