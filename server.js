const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");
const userAuthentication = require("./routes/user/userAuthentication")
const userProfile = require("./routes/user/userProfile")
const orginizationAuthentication = require("./routes/orginization/orginizationAuthentication")
const jobs = require("./routes/orginization/postJob")
const orginizationProfile = require('./routes/orginization/orginizationProfile')
const favourite = require('./routes/user/favourite')
const appliedJobs = require('./routes/user/appliedJobs')
const resumes = require('./routes/user/resume')
const coverLetter = require('./routes/user/coverLetter')
const adminAuthentication = require('./routes/admin/adminAuthentication')
const saveResume = require('./routes/orginization/saveResume')
const Orginization = require("./model/orginization/orginizationAuthentication")
const subscriptionPlan = require("./routes/orginization/subuscriptionplan")

var PORT = process.env.PORT || 5000;

mongoose
  .connect(
    "mongodb+srv://bhsjobportal:fbz4lRVJYtXs7qKe@cluster0.itkhalq.mongodb.net/"
  )
  .then((res) => {
    console.log("ressss=>>");
  })
  .catch((err) => {
    console.log("errrr=>", err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use("/api", orginizationAuthentication)
app.use("/api", adminAuthentication)
app.use("/api", userAuthentication)
app.use("/api", userProfile)
app.use("/api", jobs)
app.use("/api", favourite)
app.use("/api", appliedJobs)
app.use("/api", resumes)
app.use("/api", saveResume)
app.use("/api", orginizationProfile)
app.use("/api", subscriptionPlan)
app.use("/api", coverLetter)

app.listen(PORT, (req, res) => {
  console.log("server is running on port", PORT);
});
