const mongoose = require("mongoose");

const UserAppliedJobs = new mongoose.Schema(
  {
    companyId: { type: String },
    userId: { type: String },
    jobId: { type: String },
  },
  {
    collection: "UserAppliedJobs",
  }
);

const model = mongoose.model("AppliedJobs", UserAppliedJobs);

module.exports = model;
