const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Users = require("../../model/user/userAuthentication");
const Jobs = require("../../model/orginization/postJob");
const nodemailer = require("nodemailer");

router.get("/getUser/:id", async (req, res) => {
  console.log("CALLED");
  const { id } = req.params;
  try {
    const result = await Users.findOne({ _id: id, role: "Candidate" }).select(
      "name email phoneNumber userImage _id address city state country jobDescription"
    );

    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const result = await Users.find({ role: "Candidate" }).select(
      "-password"
    );

    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/updateUserProfile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Users.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    result["password"] = null;
    res.status(200).send({
      data: result,
      status: "ok",
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.post("/changePasswordUser", async (req, res) => {
  const { email, password, newPassword } = req.body;
  let result = await Users.findOne({ email, role: "Candidate" });
  if (result) {
    if (await bcrypt.compare(password, result.password)) {
      let hashedPassword = await bcrypt.hash(newPassword, 10);
      let updateUser = await Users.updateOne(
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

router.post("/profileCompletion", async (req, res) => {
  const { education, basicInfo, experience, about, skills, portfolio } = req.body;
  let percentage = 0
  try {
    if (basicInfo) {
      for (const key in basicInfo) {
        if (basicInfo[key] !== "") {
          percentage = percentage + 2.5
        }
      }

    }
    if (about !== "") {
      percentage = percentage + 10
    }
    if (education?.length > 0) {
      percentage = percentage + 10
    } if (experience?.length > 0) {
      percentage = percentage + 10
    }
    if (skills?.length > 0) {
      percentage = percentage + 10
    }
    if (portfolio?.length > 0) {
      percentage = percentage + 10
    }

    let data = percentage / 60 * 100
    res.status(200).send({
      data: data,
      status: "ok",
    });
  } catch (error) {
    console.log(error, "erororrorooro");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
})

router.post("/sendSupportEmail", async (req, res) => {
  const { email, name, message } = req.body;
  try {
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
      from: email,
      to: "bhsjobportal@gmail.com",
      subject: `Support Email From ${name}`,
      text: message,
    };
    mail.sendMail(mailOptions, (err, result) => {
      if (err) {
        console.log(err, "errr");
        res.status(400).send({
          status: "error",
          message: "Something went Wrong",
        });
      } else {
        console.log("calledddd");
        res.send({
          status: "ok",
          message: "Email Sent Successfully",
        });
      }
    });

  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });

  }
})

router.get("/getTotalPostedJob/:id",async(req,res)=>{
  const {id}=req.params;
  try {
    const totalJobs=await Jobs.find({companyId:id});
    let totalApplicants=0
     for (let index = 0; index < totalJobs.length; index++) {
      const element = totalJobs[index]?.appliedCandidate?.length;
      totalApplicants += element;
    }
    const data={
      totalJobs:totalJobs.length,
      totalApplicants:totalApplicants
    }
    res.status(200).send({
      status:"ok",
      data:data
    })
  } catch (error) {
    res.status(400).send({
      status:"error",
      message:"Something went wrong"
    })
  }
 
})

module.exports = router;
