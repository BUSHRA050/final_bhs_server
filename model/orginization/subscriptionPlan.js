const mongoose = require("mongoose");
const moment=require("moment")
const SubscriptionPlan = new mongoose.Schema(
  {
    organizationId: { type: String },
    image:{type:String},
    date:{type:String,default:moment(new Date()).format("DD-MM-YYYY")},
    purchasedPlan:{type:String}
  },
  {
    collection: "SubscriptionPlan",
  }
);

const model = mongoose.model("SubscriptionPlan", SubscriptionPlan);

module.exports = model;
