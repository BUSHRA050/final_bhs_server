const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Orginization = require("../../model/orginization/orginizationAuthentication");
const Otp = require("../../model/user/otp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET =
  "sfaosoowennsflaaoosdnqnwieieiwdnsnnsasdasdkasdkqwiebsicxzicbzibaibdd";
const moment = require("moment")

router.post("/registerOrginization", async (req, res) => {
  const nextDate = new Date()
  nextDate.setDate(new Date().getDate() + 30)
  const formatedDate = moment(nextDate).format("YYYY-MM-DD")
  let currentDate = moment(new Date()).format("YYYY-MM-DD")
  //  console.log(formatedDate,"formated");
  //  console.log(currentDate,"currentDate");
  const {
    name,
    email,
    phoneNumber,
    password: plainText,
    code,
    orginizationImage,
  } = req.body;
  console.log(req.body, "BODYYYYYYY=>>>>>");

  if (!name || typeof name !== "string") {
    return res.json({
      status: "error",
      message: "Invalid Username",
    });
  }

  if (!plainText || typeof plainText !== "string") {
    return res.json({
      status: "error",
      message: "Invalid password",
    });
  }

  if (plainText.length < 5) {
    res.status(400).send({
      message: "Password should be greater than 5 character",
      status: "error",
    });
  }
  let password = await bcrypt.hash(plainText, 10);
  console.log(email, code, "THIGNSS");
  let data = await Otp.find({ email, otp: code });
  console.log(data, "DDDDDDDDDDDDD");
  const response = {};
  if (data.length > 0) {
    let time = new Date().getTime();
    let diff = data[0].expiresIn - time;
    console.log(diff, "DIFFFF");
    if (diff < 0) {
      const result = await Otp.findByIdAndDelete({ _id: data[0]._id }).exec(
        function (err, resuuuu) {
          if (err) {
            console.log(err, "ERRRRORRRR");
          } else {
            console.log(resuuuu, "RRRRRRRRRRRRRRRRRRR");
          }
        }
      );
      console.log(result, "RXXXXXXXXXXXXX");
      res.status(400).send({
        message: "Code Expired",
        status: "error",
      });
    } else {
      try {
        const result = await Orginization.create({
          name,
          password,
          phoneNumber,
          orginizationImage,
          email: req.body.email,
          planStartDate: currentDate,
          planEndDate: formatedDate
        });
        res.json({
          message: "orginization created successfully",
          status: "ok",
        });
      } catch (error) {
        if (error.code == 11000) {
          return res.status(400).json({
            status: "error",
            message: "email or phone already in use",
          });
        }
        console.log(error, "ER");
        return res.status(400).json({
          status: "error",
          message: "something went wrong",
        });
      }
    }
  } else {
    res.status(400).send({
      message: "Invalid Code or email",
      status: "error",
    });
  }
});

router.post("/loginOrginization", async (req, res) => {
  const { email, password } = req.body;
  try {
    await Orginization.findOne({ email }, async (err, user) => {
      if (!user) {
        return res.status(400).send({
          status: "error",
          message: "email not found",
        });
      }
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          {
            id: user._id,
            name: user.name,
          },
          JWT_SECRET
        );
        let responsesssss = await Orginization.findOneAndUpdate(
          { _id: user._id },
          { new: true }
        );
        if (user && user.isApproved) {
          user["password"] = null;
          const params = {
            token: token,
            userDetails: user,
          };
          return res.json({
            status: "ok",
            data: params,
          });
        } else {
          return res.status(400).json({
            status: "error",
            message: "Your account is not approved",
          });
        }
      }
      res
        .status(400)
        .send({ status: "error", message: "Invalid email or password" });
    }).clone();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

// router.post("/resetPasswordUser", async (req, res) => {
//   const { email, otp, password } = req.body;
//   try {
//     let data = await Otp.find({ email, otp });
//     console.log(data, "DDDDDDDDDDDDD");
//     const response = {};
//     if (data.length > 0) {
//       let time = new Date().getTime();
//       let diff = data[0].expiresIn - time;
//       if (diff < 0) {
//         const result = await Otp.findByIdAndDelete({ _id: data[0]._id }).exec(
//           function (err, resuuuu) {
//             if (err) {
//               console.log(err, "ERRRRORRRR");
//             } else {
//               console.log(resuuuu, "RRRRRRRRRRRRRRRRRRR");
//             }
//           }
//         );
//         console.log(result, "RXXXXXXXXXXXXX");
//         res.status(400).send({
//           message: "Token Expired",
//           status: "error",
//         });
//       } else {
//         let user = await Orginization.findOne({ email });
//         if (user) {
//           const hashed = await bcrypt.hash(password, 10);
//           const _id = user.id;
//           await Orginization.updateOne(
//             { _id },
//             {
//               $set: { password: hashed },
//             }
//           );
//           const result = Otp.findByIdAndDelete({ _id: data[0]._id }).exec(
//             function (err, resuuuu) {
//               if (err) {
//                 // res.status(400).send({ error: "id not found" })
//               } else {
//                 //     if (resuuuu) return res.send({ data: resuuuu, status: "ok" })
//                 //     else
//                 //         return res.send({ data: "not found" })
//                 // }
//               }
//             }
//           );

//           res.status(200).send({
//             status: "ok",
//             message: "Successfully Reset password",
//           });
//         } else {
//           res.status(400).send({
//             status: "error",
//             message: "Email not found",
//           });
//         }
//       }
//     } else {
//       res.status(400).send({
//         message: "Invalid Otp",
//         status: "error",
//       });
//     }
//   } catch (error) {
//     res.status(400).send({
//       status: "error",
//       message: "Something went wrong",
//     });
//   }
// });

module.exports = router;
