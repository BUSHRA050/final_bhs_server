const mongoose = require("mongoose")
const moment = require("moment")

const jobSchema = new mongoose.Schema(
    {
        jobTitle: { type: String },
        isMultipleHirirng: { type: Boolean },
        isUrgentHiring: { type: Boolean },
        image: { type: String },
        isFeatured: { type: Boolean },
        jobPosition: { tyep: String },
        experienceRequire: { type: String, require: true },
        requirements: { type: String },
        description: { type: String },
        city: { type: String },
        minSalary: { type: String },
        maxSalary: { type: String },
        jobType: { type: String },
        country: { type: String },
        date: { type: String, default: moment(new Date()).format("DD-MMM-YYYY") },
        isActive: { type: Boolean, default: true },
        category: { type: String, require: true },
        companyId: { type: String, require: true },
        companyName:{type:String},
        fullAddress: { type: String },
        lastDate: { type: Date },
        compnayDetails: { type: Object },
        appliedCandidate: { type: Array, default: [] },
        favourite: { type: Array, default: [] },
        appliedCandidateIds: { type: Array, default: [] }
    }, {
    collection: "Jobs"
}
)
const model = mongoose.model("Jobs", jobSchema);

module.exports = model;
