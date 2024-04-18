const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const CoverLetter = require("../../model/user/coverLetter");
const moment = require("moment")
const Users = require("../../model/user/userAuthentication");


router.post("/createCoverLetter", async (req, res) => {
  const {
    userId,
    name,
    location,
    phone,
    email,
    jobDescription,
    recipient,
    description,
    category,
   
  } = req.body
  try {
    const coverLetter = new CoverLetter({
      userId,
      name,
      location,
      phone,
      email,
      recipient,
      description,
      jobDescription,
      category
    })
    const result = await coverLetter.save();
    res.status(200).send({
      status: "ok",
      data: result,
      message: "Cover Letter created Successfully",
    });
    console.log("Cover Success");
  } catch (error) {
    console.log(error, "Cover Error");
    return res.status(400).json({
      status: "error",
      message: "something went wrong",
    });
  }
})

router.get("/getCoverLetterById/:id", async (req, res) => {
  console.log("CALLED");
  const { id } = req.params;
  try {
    const result = await CoverLetter.findOne({ userId: id })
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

router.get("/getCoverLetter/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id,"iddddddddddddddddddddddddddddddd");
    const result = await CoverLetter.findOne({_id:id});
    const user = await Users.findOne({ _id: result.userId })
    let data = {
      user,
      coverLetter: result
    }
    res.status(200).send({ data: data, status: "ok" });
  } catch (error) {
    console.log(error,"errorrrrrrrrrrrrrrrrr");
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

router.get("/getAllCoverLetter", async (req, res) => {
  try {
    const result = await CoverLetter.find()
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

// router.post("/getAllResumeByFilter", async (req, res) => {
//   const { page } = req.params
//   let size = 15
//   try {
//     let Dymanictype = req.body.type;
//     let regex = new RegExp(req.body.filter, "i");
//     let skip = page * size
//     console.log(regex, "kdlkdkkdkldk");
//     let filter = req.body.filter;
//     const result = await Resumes.find({ [Dymanictype]: regex })
//       .skip(skip)
//       .limit(15)
//     console.log(skip, "jidjkjdkjkjkjkje");
//     console.log(req.body.type, "tyyryryyryyr");
//     console.log(page, "djdjjdfffff");
//     res.status(200).send({ data: result, status: "ok" });
//   } catch (error) {
//     res.status(400).send({ status: "error", message: "something went wrong" });
//     console.log(error, "klkdklkdfklkkdkkdfk");
//   }
// });

router.post("/getAllCoverLetterByCategory", async (req, res) => {
  const { category } = req.body
  try {
    const result = await CoverLetter.find({ category })
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

router.put("/updateCoverLetter/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CoverLetter.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).send({
      data: result,
      status: "ok",
      message: "Cover Letter Updated Successfully",
    });
  } catch (error) {
    console.log(error,"errror=========>");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.delete("/deleteCoverLetter/:id", async (req, res) => {
  try {
    const result = CoverLetter.findByIdAndDelete({ _id: req.params.id })
    res.status(200).send({
              message: "Cover Letter Deleted Successfully",
              status: "ok",
            })
  } catch (error) {
    console.log("errrrrrrrorrrr=>>", error);
    res.status(400).send({ message: "Something went wrong", status: "error" });
  }
});

// router.post("/addReviewResume/:id", async (req, res) => {
//   console.log("BODYYY");
//   const { id } = req.params;
//   const { companyId, review, rating, name } = req.body;
//   try {
//     const resume = await Resumes.findOne({ _id: id });
//     let data = [];
//     data = resume.reviews;
//     data.push({
//       review: review,
//       rating: rating,
//       name,
//       date: moment(new Date()).format("DD-MMM-YYYY"),
//       companyId,
//     });

//     const userResume = await Resumes.findByIdAndUpdate(
//       { _id: id },
//       { reviews: data },
//       {
//         new: true,
//         useFindAndModify: true,
//       }
//     );
//     res.status(200).send({
//       status: "ok",
//       data: "Review added successfully",
//     });
//   } catch (error) {
//     console.log(error, "ERRRRRRRRRR");
//     res.status(400).send(error);
//   }
// });

module.exports = router;
