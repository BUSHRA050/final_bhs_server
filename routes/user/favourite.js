const express = require("express");
const router = express.Router();
const Favourite = require("../../model/user/favourite");
const Jobs = require("../../model/orginization/postJob");

router.post("/addFavourite", async (req, res) => {
  const { orginizationId, userId, jobId } = req.body;
  try {
    const favourite = await Favourite.findOne({ jobId })
    if (favourite) {
      res.status(400).send({
        status: "error",
        message: "You have already added this job in favourite",
      });
    } else {
      const data = await Jobs.findOne({
        _id: jobId,
      });
      console.log(data, "datadata");
      if (data) {
        let fav = data.favourite
        fav.push(userId)
        const updatedJob = await Jobs.findByIdAndUpdate(
          { _id: jobId },
          { favourite: fav },
          {
            new: true,
          }
        );
        console.log(data, "DATAAAAAAAAAA");
        const favourite = new Favourite(req.body);
        const result = await favourite.save();

        res.send({
          data: data,
          status: "ok",
          message: "Added To Favourite Successfully",
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

router.get("/getFavourite/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let tempArr = [];
    const find = await Favourite.find({ userId: id });
    await Promise.all(
      find.map(async (data) => {
        let jobs = await Jobs.findOne({ _id: data.jobId }).select("-appliedCandidate");
        tempArr.push(jobs);
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

router.delete("/removeFavourite", async (req, res) => {
  const { jobId, userId } = req.body
  try {
    let deletedResult = await Favourite.deleteOne({
      jobId: jobId,
    });
    let data = await Jobs.findOne({ _id: jobId })
    const index = data.favourite.indexOf(userId);
    data.favourite.splice(index, 1);
    const updatedRes = await Jobs.findByIdAndUpdate(
      { _id: data._id },
      { favourite: data.favourite },
      {
        new: true,
      }
    );
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
