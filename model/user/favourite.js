const mongoose = require("mongoose");

const UserFavouriteSchema = new mongoose.Schema(
  {
    orginizationId: { type: String },
    userId: { type: String },
    jobId:{type:String},
  },
  {
    collection: "favouriteJobs",
  }
);

const model = mongoose.model("UserFavourite", UserFavouriteSchema);

module.exports = model;
