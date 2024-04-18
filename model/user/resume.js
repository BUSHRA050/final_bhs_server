const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        name: { type: String, default: "" },
        location: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        jobDescription: { type: String, default: "" },
        objective: { type: String, default: "" },
        about: { type: String, default: "" },
        image: { type: String, default: "" },
        skills: { type: Array, default: [] },
        linkedin: { type: String, default: "" },
        gitHub: { type: String, default: "" },
        education: { type: Array, default: [] },
        experience: { type: Array, default: [] },
        portFolio: { type: Array, default: [] },
        hobbies: { type: Array, default: [] },
        viewdComapnies: { type: Array, default: [] },
        reviews: { type: Array, default: [] },
        category: { type: String, default: "" },
        selectedTemplate:{type:String},
    },
    { collection: "Resume" }
)
const model = mongoose.model("Resume", resumeSchema);

module.exports = model;
