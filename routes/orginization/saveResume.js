const express = require("express");
const router = express.Router();
const SavedResume = require("../../model/orginization/saveResume");
const Resume = require("../../model/user/resume");

router.post("/saveResume", async (req, res) => {
  const { orginizationId,userId,resumeId } = req.body;
  try {
    const resume=await SavedResume.findOne({resumeId})
    if (resume) {
      res.status(400).send({
        status: "error",
        message: "You have already saved this resume",
      });
    }else{
    const data = await Resume.findOne({
      _id:resumeId,
    });
    console.log(data, "datadata");
    if (data) {
      console.log(data, "DATAAAAAAAAAA");
      const newresume = new SavedResume(req.body);
      const result = await newresume.save();

      res.send({
        data: data,
        status: "ok",
        message: "Added To SavedResume Successfully",
      });
    } else {
      res.status(400).send({
        status: "error",
        message: "no data found",
      });
    }
  }
  } catch (error) {
    console.log(error, "ERRRRRRRRRRR");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.get("/getSavedResume/:id", async (req, res) => {
  const {id } = req.params;
  try {
    let tempArr = [];
    const find = await SavedResume.find({ orginizationId:id });
    await Promise.all(
      find.map(async (data) => {
        let resume = await Resume.findOne({ _id: data.resumeId });
        tempArr.push(resume);
      })
    );
    res.send({
      data: tempArr,
      status: "ok",
      message: "Succesful",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.delete("/removeSavedResume/:id", async (req, res) => {
  const {id } = req.params;
  try {
      let deletedResult = await SavedResume.deleteOne({
        _id:id,
      });
      res.status(200).send({
        status: "ok",
        message: "Removed Successfully",
      });
  } catch (error) {
    console.log(error, "ERRRRRRRRRRR");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
