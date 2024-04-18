const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Orginization = require("../../model/user/userAuthentication");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET =
  "sfaosoowennsflaaoosdnqnwieieiwdnsnnsasdasdkasdkqwiebsicxzicbzibaibdd";
const Users = require("../../model/user/userAuthentication");



router.get("/getOrginizationById/:id", async (req, res) => {
  console.log("CALLED");
  const { id } = req.params;
  try {
    const result = await Orginization.findOne({ _id: id, role: "Organization" }).select(
      "-password"
    );

    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getAllOrginization", async (req, res) => {
  console.log("called apiiiii");
  try {
    const result = await Orginization.find({ role: "Organization" }).select("-password");

    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ error, status: "error" });
  }
});


router.put("/updateOrginizationProfile/:id", async (req, res) => {
  console.log("calledddddddddddd");
  const { id } = req.params;
  try {
    const result = await Orginization.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(result, "resulttttttttttttttt");
    // result["password"] = null;
    res.status(200).send({
      data: result,
      status: "ok",
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error, "errorrrrrrrrrrr");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.put("/updateOrginizationStatus/:id", async (req, res) => {
  console.log("called");
  const { id } = req.params;
  try {
    const result = await Orginization.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(result, "dllkdldkdldlk");
    result["password"] = null;
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
      to: result?.email,
      subject: "Orginization Status Changed",
      text: result?.isApprove ? `Congratulations ${result?.name} approved by Jobia admin now you can access Jobia services easily`
        :
        `Sorry ${result?.name} status dismantel by Jobia admin now you can not access Jobia services for further
      information please contact Jobia admin
      `
      ,
    };
    console.log(mailOptions, "mailOptions");
    mail.sendMail(mailOptions, (err, result) => {
      if (err) {
        console.log(err, "errr");
      } else {
        console.log("calledddd");
      }
    });
    res.status(200).send({
      data: result,
      status: "ok",
      message: "Orginization Status Updated Successfully",
    });
  } catch (error) {
    console.log(error, "dkldkldkldk");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.post("/sendconfirmationemail", async (req, res) => {
  const { email,companyname,jobDescription ,companyemail} = req.body;
  try {
   

    var mail = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Jobia4801@gmail.com",
        pass: "grhtvruaqsucqcsz",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: "noreply@jobia",
      to: email,
      subject: "INTERVIEW CALL",
      text: `Congratulations! We are pleased to inform you that you have been shortlisted for the ${jobDescription} role at ${companyname}. Your qualifications and experience align closely with what we are looking for in a candidate.
      Our Human Resource department will contact you as soon as possible. If tou have any query please contact at  ${companyemail}`
    };
    mail.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err, "errr");
      } else {
        console.log("calledddd");
      }
    });
    res.status(200).send({
      status: "ok",
      message: "Email send sucessfully",
    });
  } catch (error) {
    console.log(error, "dkldkldkldk");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.post("/changePasswordOrginization", async (req, res) => {
  const { email, password, newPassword } = req.body;
  let result = await Users.findOne({ email, role: "Organization" });
  if (result) {
    if (await bcrypt.compare(password, result.password)) {
      let hashedPassword = await bcrypt.hash(newPassword, 10);
      let updateUser = await Orginization.updateOne(
        { _id: result._id },
        { $set: { password: hashedPassword } }
      );
      res.status(200).send({ status: "ok", message: "Updated Successfully" });
    } else {
      res.status(400).send({
        status: "error",
        message: "Current Password is Invalid",
      });
    }
  } else {
    res.status(400).send({
      status: "error",
      message: "Current Password or email is Invalid",
    });
  }
});

module.exports = router;
