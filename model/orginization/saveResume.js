const mongoose = require("mongoose");

const SaveResumeSchema = new mongoose.Schema(
  {
    orginizationId: { type: String },
    userId: { type: String },
    resumeId:{type:String},
  },
  {
    collection: "SavedResume",
  }
);

const model = mongoose.model("savedResume", SaveResumeSchema);

module.exports = model;
