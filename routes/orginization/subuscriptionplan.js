const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const SubscriptionPlan = require("../../model/orginization/subscriptionPlan");
const Orginization = require("../../model/user/userAuthentication");
const Admin = require("../../model/admin/adminAuthentication");

router.post("/buySubscriptionPlan", async (req, res) => {
  const { organizationId, image, purchasedPlan } = req.body;
  try {
    const admin = Admin.findOne();
    const orginization = await Orginization.findOne({
      _id: organizationId,
      role: "Organization",
    });
    const result = new SubscriptionPlan({
      organizationId,
      image,
      purchasedPlan,
    });
    const plan = result.save();
    var mail = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bhsjobportal@gmail.com",
        pass: "coafbmobrzeomero",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: "noreply@BHS",
      to: admin.email,
      subject: "Subscription Plan Purchased",
      text: `${orginization.name} has purchased the ${purchasedPlan} plan for further information
            please check ${orginization.name} orginization detail page
            `,
    };
    mail.sendMail(mailOptions, (err, result) => {
      if (result) {
        console.log(result, "hdjhdjhdhjhdjddjhjd");
      } else {
        console.log(err, "errorerrorerrorerror");
      }
    });
    res.status(200).send({
      status: "ok",
      data: plan,
      message:
        "Plan buyed successfully now wait a while for admin side activation for plan",
    });
  } catch (error) {
    console.log(error, "Error");
    return res.status(400).json({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.get("/getSubscriptionPlanById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SubscriptionPlan.find({ orginizationId: id });
    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    console.log(error, "Error");
    return res.status(400).json({
      status: "error",
      message: "something went wrong",
    });
  }
});

module.exports = router;
