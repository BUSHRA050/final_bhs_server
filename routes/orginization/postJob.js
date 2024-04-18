const express = require("express");
const router = express.Router();
const UserAppliedJobs = require("../../model/user/appliedjobs");
const Jobs = require("../../model/orginization/postJob");
const User = require("../../model/user/userAuthentication");
const Resume = require("../../model/user/resume");
const moment = require("moment")

router.get("/getAllJobs", async (req, res) => {

  try {
    const city = req.query.city;
    let cityRegex = new RegExp(city, "i");
    const jobTitle = req.query.jobTitle;
    let jobTitleRegex = new RegExp(jobTitle, "i");
    const category = req.query.category;
    let categoryRegex = new RegExp(category, "i");
    const experience = req.query.experienceRequire;
    let experienceRegex = new RegExp(experience, "i");
    if (city && jobTitle) { // if city and jobTitle is true
      const result = await Jobs.find({ isActive: true, city: cityRegex, jobTitle: jobTitleRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    }
    else if (city) { // if city is true
      const result = await Jobs.find({ isActive: true, city: cityRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    }

    else if (jobTitle) { // if jobTitle is true
      const result = await Jobs.find({ isActive: true, jobTitle: jobTitleRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    }

    else if (category) { // if category is true
      const result = await Jobs.find({ isActive: true, category: categoryRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    }

    else if (experience) { // if experience is true
      const result = await Jobs.find({ isActive: true, experienceRequire: experienceRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    }
    else if (city && jobTitle && category) { // if city and jobTitle and category is true
      const result = await Jobs.find({ isActive: true, city: cityRegex, jobTitle: jobTitleRegex, category: categoryRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (city && jobTitle && experience) { // if city and jobTitle and experience is true
      const result = await Jobs.find({ isActive: true, city: cityRegex, jobTitle: jobTitleRegex, experienceRequire: experienceRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (city && category && experience) { // if city and category and experience is true
      const result = await Jobs.find({ isActive: true, city: cityRegex, category: categoryRegex, experienceRequire: experienceRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (jobTitle && category && experience) { // if jobTitle and category and experience is true
      const result = await Jobs.find({ isActive: true, jobTitle: jobTitleRegex, category: categoryRegex, experienceRequire: experienceRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (city && jobTitle && category && experience) { // if city and jobTitle and category and experience is true
      const result = await Jobs.find({ isActive: true, city: cityRegex, jobTitle: jobTitleRegex, category: categoryRegex, experienceRequire: experienceRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (category && experience) { // if category and experience is true
      const result = await Jobs.find({ isActive: true, category: categoryRegex, experienceRequire: experienceRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (jobTitle && experience) { // if jobTitle and experience is true
      const result = await Jobs.find({ isActive: true, jobTitle: jobTitleRegex, experienceRequire: experienceRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (jobTitle && category) { // if jobTitle and category is true
      const result = await Jobs.find({ isActive: true, jobTitle: jobTitleRegex, category: categoryRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (category && city) { // if category and city is true
      const result = await Jobs.find({ isActive: true, category: categoryRegex, city: cityRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else if (experience && city) { // if experience and city is true
      const result = await Jobs.find({ isActive: true, experienceRequire: experienceRegex, city: cityRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else {
      const result = await Jobs.find({ isActive: true }) // if all is false
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    }

  } catch (error) {
    res.status(400).send({ error, message: "No data found" })
  }
})

router.get("/getJobByType", async (req, res) => {
  try {
    const jobType = req.query.jobType;
    let jobTypeRegex = new RegExp(jobType, "i");
    if (jobTypeRegex === "") {
      const result = await Jobs.find({ isActive: true })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    } else {
      const result = await Jobs.find({ isActive: true, jobType: jobTypeRegex })
      res.status(200).send({ data: result.reverse(), status: "Ok" })
    }
  } catch (error) {
    res.status(400).send({ error, message: "No data found" })
  }
})


router.post("/createJob", async (req, res) => {
  const {
    jobPosition,
    experienceRequire,
    requirements,
    description,
    city,
    category,
    companyId,
    compnayDetails,
    minSalary,
    maxSalary,
    country,
    fullAddress,
    jobType,
    jobTitle,
    lastDate,
  } = req.body
  try {
    const orginization = await User.findOne({ _id: companyId, role: "Organization" })
    const orginizationJobs = await Jobs.find({ companyId: companyId })
    if (orginization.plan == "Free" && orginization.planStartDate !== orginization.planEndDate && orginizationJobs.length < 10) {
      const jobs = new Jobs({
        jobPosition,
        jobTitle,
        experienceRequire,
        requirements,
        description,
        companyName:orginization?.name,
        city,
        lastDate,
        category,
        companyId,
        compnayDetails,
        minSalary,
        maxSalary,
        country,
        fullAddress,
        jobType,
      })
      const result = await jobs.save();
      res.status(200).send({
        status: "ok",
        data: result,
        message: "Job Posted Successfully",
      });
    } else if (orginization.isApprove && orginization.isPaid && orginization.plan == "Basic" && orginization.planStartDate !== orginization.planEndDate && orginizationJobs.length < 20) {
      const jobs = new Jobs({
        jobPosition,
        jobTitle,
        experienceRequire,
        requirements,
        description,
        companyName:orginization?.name,
        lastDate,
        city,
        category,
        companyId,
        compnayDetails,
        minSalary,
        maxSalary,
        country,
        fullAddress,
        jobType
      })
      const result = await jobs.save();
      res.status(200).send({
        status: "ok",
        data: result,
        message: "Job Posted Successfully",
      });
    } else if (orginization.isApprove && orginization.isPaid && orginization.plan == "Standard" && orginization.planStartDate !== orginization.planEndDate && orginizationJobs.length < 30) {
      const jobs = new Jobs({
        jobPosition,
        jobTitle,
        experienceRequire,
        requirements,
        description,
        city,
        category,
        companyId,
        compnayDetails,
        lastDate,
        companyName:orginization?.name,
        minSalary,
        maxSalary,
        country,
        fullAddress,
        jobType
      })
      const result = await jobs.save();
      res.status(200).send({
        status: "ok",
        data: result,
        message: "Job Posted Successfully",
      });
    } else if (orginization.isApprove && orginization.isPaid && orginization.plan == "Premium" && orginization.planStartDate !== orginization.planEndDate && orginizationJobs.length < 50) {
      const jobs = new Jobs({
        jobPosition,
        jobTitle,
        experienceRequire,
        requirements,
        description,
        city,
        category,
        companyId,
        lastDate,
        compnayDetails,
        companyName:orginization?.name,
        minSalary,
        maxSalary,
        country,
        fullAddress,
        jobType
      })
      const result = await jobs.save();
      res.status(200).send({
        status: "ok",
        data: result,
        message: "Job Posted Successfully",
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "You have reached your plan limit for futher info please contact at bhsjobportal@gmail.com",
      });
    }


  } catch (error) {
    console.log(error, "Error");
    return res.status(400).json({
      status: "error",
      message: "something went wrong",
    });
  }
})

router.get("/getJobsById/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id, "mdmdmf,mfm,fm");
  try {
    const jobs = await Jobs.find({ companyId: id });
    res.status(200).send({ data: jobs, status: "ok" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong", status: "error" });
  }
});

router.post("/getJobsByCategory", async (req, res) => {
  const { category } = req.body;
  try {
    const jobs = await Jobs.find({ category });
    res.status(200).send({ data: jobs, status: "ok" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong", status: "error" });
  }
})

router.post("/getJobsByCity", async (req, res) => {
  const { city } = req.body;
  try {
    const jobs = await Jobs.find({ city });
    res.status(200).send({ data: jobs, status: "ok" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong", status: "error" });
  }
})

router.put("/updateJob/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updateJob = await Jobs.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: true,
    });
    res.status(200).send({
      data: updateJob,
      status: "ok",
      message: "Job updated successfully",
    });
  } catch (error) {
    res.status(400).send({ message: "Product not Found", status: "error" });
  }
});


router.delete("/deleteJob/:id", async (req, res) => {
  try {
    const result = Jobs.findByIdAndDelete({ _id: req.params.id }).exec(
      function (err, resuuuu) {
        if (err) {
          res.status(400).send({ error: "id not found" });
        } else {
          if (resuuuu)
            return res.send({
              message: "Job Deleted Successfully",
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

router.post("/applyPostedJob/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, companyId } = req.body;
  try {
    const user = await UserAppliedJobs.findOne({ userId: userId })
    const userDetails = await User.findOne({ _id: userId })
    const job = await Jobs.findOne({ _id: id, isActive: true });
    const resume = await Resume.findOne({ userId: userId });
    // console.log(user,"user")
    if (user) {
      console.log("im else");
      res.status(200).send({
        status: "ok",
        data: "Sorry can not apply more than one time",
      });
    } else {

      let data = [];
      data = job.appliedCandidate;
      data.push({
        name: userDetails?.name,
        userId: userId,
        image: userDetails?.userImage,
        jobDescription: userDetails?.jobDescription,
        contactNo: userDetails?.phoneNumber,
        resume: resume,
        resumeScore: "",
        appliedDate: moment(new Date()).format("DD-MMM-YYYY"),
      });

      const jobObj = await Jobs.findByIdAndUpdate(
        { _id: id },
        { appliedCandidate: data },
        {
          new: true,
          useFindAndModify: true,
        }
      );
      const NewData = await Jobs.findOne({
        _id: id,
      });
      console.log(NewData, "datadata");
      if (NewData) {
        const appliedJob = new UserAppliedJobs({ userId, orginizationId: companyId, jobId: id });
        const result = await appliedJob.save();
      }
      res.status(200).send({
        status: "ok",
        data: "Applied job successfully",
      });
    }
  } catch (error) {
    console.log(error, "ERRRRRRRRRR");
    res.status(400).send(error);
  }
});

module.exports = router;
