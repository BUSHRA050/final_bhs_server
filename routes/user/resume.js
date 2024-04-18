const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Resumes = require("../../model/user/resume");
const moment = require("moment")
const Users = require("../../model/user/userAuthentication");

router.post("/createResume", async (req, res) => {
  const {
    userId,
    name,
    city,
    address,
    about,
    email,
    objective,
    position,
    image,
    skills,
    linkedin,
    gitHub,
    education,
    experience,
    portFolio,
    hobbies,
    category,
  } = req.body
  try {
    const resume = new Resumes({
      userId,
      name,
      city,
      address,
      email,
      objective,
      position,
      image,
      skills,
      linkedin,
      gitHub,
      education,
      experience,
      portFolio,
      hobbies,
      category,
    })
    const result = await resume.save();
    res.status(200).send({
      status: "ok",
      data: result,
      message: "Resume created Successfully",
    });
  } catch (error) {
    console.log(error, "sundassssssss");
    return res.status(400).json({
      status: "error",
      message: "something went wrong",
    });
  }
})

router.get("/getResumeById/:id", async (req, res) => {
  console.log("CALLED");
  const { id } = req.params;
  try {
    const result = await Resumes.findOne({ userId: id })
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

router.get("/getResume/:id", async (req, res) => {
  console.log("CALLED");
  const { id } = req.params;
  try {
    const result = await Resumes.findOne({ _id: id })
    const user = await Users.findOne({ _id: result.userId })
    let data = {
      user,
      resume: result
    }
    res.status(200).send({ data: data, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

router.get("/getAllResume", async (req, res) => {
  try {
    const result = await Resumes.find()
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});



router.post("/getAllResumeByCity", async (req, res) => {
  const { city } = req.body
  try {
    const result = await Resumes.find({ city })
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

router.post("/getAllResumeByFilter", async (req, res) => {
  const { page } = req.params
  let size = 15
  try {
    let Dymanictype = req.body.type;
    let regex = new RegExp(req.body.filter, "i");
    let skip = page * size
    console.log(regex, "kdlkdkkdkldk");
    let filter = req.body.filter;
    const result = await Resumes.find({ [Dymanictype]: regex })
      .skip(skip)
      .limit(15)
    console.log(skip, "jidjkjdkjkjkjkje");
    console.log(req.body.type, "tyyryryyryyr");
    console.log(page, "djdjjdfffff");
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
    console.log(error, "klkdklkdfklkkdkkdfk");
  }
});

router.post("/getAllResumeByCategory", async (req, res) => {
  const { category } = req.body
  try {
    const result = await Resumes.find({ category })
    res.status(200).send({ data: result, status: "ok" });
  } catch (error) {
    res.status(400).send({ status: "error", message: "something went wrong" });
  }
});

router.put("/updateResume/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Resumes.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).send({
      data: result,
      status: "ok",
      message: "Resume Updated Successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.delete("/deleteResume/:id", async (req, res) => {
  try {
    const result = Resumes.findByIdAndDelete({ _id: req.params.id }).exec(
      function (err, resuuuu) {
        if (err) {
          res.status(400).send({ error: "id not found" });
        } else {
          if (resuuuu)
            return res.send({
              message: "Resume Deleted Successfully",
              status: "ok",
            });
          else return res.send({ data: "not found" });
        }
      }
    );
  } catch (error) {
    console.log("errrrrrrrorrrr=>>", error);
    res.status(400).send({ message: "Something went wrong", status: "error" });
  }
});

router.post("/addReviewResume/:id", async (req, res) => {
  console.log("BODYYY");
  const { id } = req.params;
  const { companyId, review, rating, name } = req.body;
  try {
    const resume = await Resumes.findOne({ _id: id });
    let data = [];
    data = resume.reviews;
    data.push({
      review: review,
      rating: rating,
      name,
      date: moment(new Date()).format("DD-MMM-YYYY"),
      companyId,
    });

    const userResume = await Resumes.findByIdAndUpdate(
      { _id: id },
      { reviews: data },
      {
        new: true,
        useFindAndModify: true,
      }
    );
    res.status(200).send({
      status: "ok",
      data: "Review added successfully",
    });
  } catch (error) {
    console.log(error, "ERRRRRRRRRR");
    res.status(400).send(error);
  }
});

module.exports = router;
