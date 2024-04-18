const express = require("express");
const router = express.Router();
const UserAppliedJobs = require("../../model/user/appliedjobs");
const Jobs = require("../../model/orginization/postJob");
const User = require("../../model/user/userAuthentication");
const Resume = require("../../model/user/resume");
const CoverLetter = require("../../model/user/coverLetter");
const natural = require('natural');
const fs = require('fs');

// router.post("/applyJobs", async (req, res) => {
//   const { companyId, userId, jobId } = req.body;
//   try {
//     const user = await User.findOne({ _id: userId });
//     const resume = await Resume.findOne({ userId: userId });
//     const coverLetter = await CoverLetter.findOne({ userId: userId });
//     const data = await Jobs.findOne({
//       _id: jobId,
//     });
//     const jobStringify = JSON.stringify(data)
//     // fs.writeFileSync('job.txt', jobStringify, 'utf8')
//     // const jobOutput = fs.readFileSync('job.txt', 'utf8')
//     const resumeStrigify = JSON.stringify(resume);
//     // fs.writeFileSync('resume.txt', resumeStrigify, 'utf8');
//     // const resumeTextOutput = fs.readFileSync('resume.txt', 'utf8');
//     const tokens = natural.PorterStemmer.tokenizeAndStem(resumeStrigify);
//     const jobTokens = natural.PorterStemmer.tokenizeAndStem(jobStringify);
//     // const jobOject = JSON.parse(jobOutput);
//     // Initialize the score to 0
//     let score = 0;

//     // Iterate over the tokens and check for each keyword
//     tokens.forEach(token => {
//       if (jobTokens.includes(token)) {
//         // If the keyword is found, increment the score
//         score += 1;
//       }
//     });

//     console.log(tokens, "tokenstokenstokenstokens")

//     console.log(jobTokens, "jobTokensjobTokensjobTokensjobTokens")

//     console.log(score, "score")


//     // Calculate the percentage of the score
//     const percentage = (score / jobTokens?.length) * 200;
//     console.log(percentage);
//     const threshold = 40;

//     // Check if the percentage is greater than the threshold
//     if (percentage > threshold) {
//       let candidate = {
//         userId: userId,
//         userDetails: user,
//         resume: resume,
//         coverLetter:coverLetter,
//         score:percentage,
//       };

//       if (data) {
//         console.log(data, "DATAAAAAAAAAA");
//         let tempArr = data.appliedCandidate;
//         let fav = data.favourite;
//         fav.push(userId);
//         tempArr.push(candidate);
//         const appliedJob = new UserAppliedJobs({ companyId, userId, jobId });
//         const updateJob = await Jobs.findByIdAndUpdate(
//           { _id: jobId },
//           { appliedCandidate: tempArr, appliedCandidateIds: fav },
//           {
//             new: true,
//             useFindAndModify: true,
//           }
//         );
//         const result = await appliedJob.save();

//         res.send({
//           data: data,
//           status: "ok",
//           message: Applied Successfully and your resume score for this job is ${Math.round(percentage)}%,
//         });
//       } else {
//         res.status(400).send({
//           status: "error",
//           message: "no data found",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: "error",
//         message: You are not eligible for this job because your resume matches ${Math.round(percentage)}%,
//       });
//     }

//   } catch (error) {
//     console.log(error, "ERRRRRRRRRRR");
//     res.status(400).send({
//       status: "error",
//       message: "something went wrong",
//     });
//   }
// });
// const natural = require('natural');

const Tokenizer = new natural.WordTokenizer();
const TfIdf = new natural.TfIdf();
const stemmer = require('natural').PorterStemmer;


function analyzeResume(job_id,user_id) {
  fetch('https://fypflaskbackend.onrender.com/analyze_resume_and_job', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ job_id: job_id, user_id: user_id })
  })
  .then(response => response.json())
  .then(data => {
      
      return data;
  })
  .catch(error => console.error('Error:', error));
}

router.post("/applyJobs", async (req, res) => {
  const { companyId, userId, jobId } = req.body;
  try {
    const cs = analyzeResume(jobId,userId); // this line is addedd
    console.log(cs);
    const user = await User.findOne({ _id: userId });
    const resume = await Resume.findOne({ userId: userId });
    const coverLetter = await CoverLetter.findOne({ userId: userId });
    const data = await Jobs.findOne({ _id: jobId });

    const tokens = natural.PorterStemmer.tokenizeAndStem(JSON.stringify(resume.about));
    const jobTokens = natural.PorterStemmer.tokenizeAndStem(JSON.stringify(data.description));
    // TF-IDF Calculation
    TfIdf.addDocument(tokens);
    TfIdf.addDocument(jobTokens);
    let tfidfScore = 0;
    tokens.forEach(token => {
      tfidfScore += TfIdf.tfidf(token, 0); // Calculate TF-IDF score for each token in resume
    });

    // Initialize the score to 0
    let score = 0;

    // Iterate over the tokens and check for each keyword
    tokens.forEach(token => {
      if (jobTokens.includes(token)) {
        // If the keyword is found, increment the score
        score += 1;
      }
    });

    // Calculate the percentage of the score
    const percentage = (score / tokens.length) * 100; // using tokens.length instead of jobTokens.length

    const threshold = 40;

    // Check if the percentage is greater than the threshold
    if (percentage > threshold) {
      let candidate = {
        userId: userId,
        userDetails: user,
        resume: resume,
        coverLetter: coverLetter,
        score: percentage, // corrected: score should be the percentage
        tfidfScore: tfidfScore,
        
      };

      if (data) {
        let tempArr = data.appliedCandidate;
        let fav = data.favourite;
        fav.push(userId);
        tempArr.push(candidate);
        const appliedJob = new UserAppliedJobs({ companyId, userId, jobId });
        const updateJob = await Jobs.findByIdAndUpdate(
          { _id: jobId },
          { appliedCandidate: tempArr, appliedCandidateIds: fav },
          {
            new: true,
            useFindAndModify: true,
          }
        );
        const result = await appliedJob.save();

        res.send({
          data: data,
          status: "ok",
          message: `Applied Successfully and your resume score for this job is ${Math.round(percentage)}%`,
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "no data found",
        });
      }
    } else {
      return res.status(400).json({
        status: "error",
        message: `You are not eligible for this job because your resume matches ${Math.round(percentage)}%`,
      });
    }

  } catch (error) {
    console.log(error, "ERRRRRRRRRRR");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.post("/applyJobsFlask", async (req, res) => {
  const { companyId, userId, jobId, score } = req.body;
  try {
    const user = await User.findOne({ _id: userId });
    const resume = await Resume.findOne({ userId: userId });
    const coverLetter = await CoverLetter.findOne({ userId: userId });
    const data = await Jobs.findOne({ _id: jobId });


    // Check if the percentage is greater than the threshold
    
      let candidate = {
        userId: userId,
        userDetails: user,
        resume: resume,
        coverLetter: coverLetter,
        score: score, // corrected: score should be the percentage
      
        
      };

      if (data) {
        let tempArr = data.appliedCandidate;
        let fav = data.favourite;
        fav.push(userId);
        tempArr.push(candidate);
        const appliedJob = new UserAppliedJobs({ companyId, userId, jobId });
        const updateJob = await Jobs.findByIdAndUpdate(
          { _id: jobId },
          { appliedCandidate: tempArr, appliedCandidateIds: fav },
          {
            new: true,
            useFindAndModify: true,
          }
        );
        const result = await appliedJob.save();

        res.send({
          data: data,
          status: "ok",
        });
      } 
        

  } catch (error) {
    console.log(error, "ERRRRRRRRRRR");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});


router.post("/getAppliedJobs", async (req, res) => {
  try {
    let tempArr = [];
    const find = await UserAppliedJobs.find(req.body);
    await Promise.all(
      find.map(async (data) => {
        let jobs = await Jobs.findOne({ _id: data.jobId, isActive: true });
        tempArr.push(jobs);
        // console.log(jobs,"Array");
        // console.log(data._id,"idddddddd");
      })
    );
    // console.log(find,"myyyArray");
    console.log(tempArr,"tempArrrrrrrrrrrrr");
    res.send({
      data: tempArr,
      status: "ok",
      message: "Succesful",
    });
  } catch (error) {
    console.log(error,"errorrrrrrrr");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.get("/getJobsByCompanyId/:id", async (req, res) => {
  try {
    const {id}= req.params;
    const find = await Jobs.find({companyId:id,isActive:true});
    res.status(200).send({
      data: find,
      status: "ok",
      message: "Succesful",
    });
  } catch (error) {
    console.log(error,"errorrrrrrrr");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.delete("/removeAppliedJobs", async (req, res) => {
  const { userId, orginizationId, jobId } = req.body;
  try {
    const data = await Jobs.findOne({
      _id: jobId,
    });
    console.log(data, "datadatadatadata");

    if (!data) {
      res.status(400).send({
        status: "error",
        message: "Data not found",
      });
    } else {
      const index = data.appliedCandidate.indexOf(userId);
      console.log(data.appliedCandidate, "djdjkjdkdkjkjdjk");
      data.appliedCandidate.splice(index, 1);
      const updatedRes = await Jobs.findByIdAndUpdate(
        { _id: data.id },
        { appliedCandidate: data.appliedCandidate },
        {
          new: true,
        }
      );
      let deletedResult = await UserAppliedJobs.deleteOne({
        orginizationId,
        userId,
        jobId,
      });
      res.status(200).send({
        status: "ok",
        message: "Removed Successfully",
      });
    }
  } catch (error) {
    console.log(error, "ERRRRRRRRRRR");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
