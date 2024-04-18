const mongoose = require("mongoose")

const CoverLetterSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        name: { type: String, default: "" },
        location: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        recipient: { type: String, default: "" },
        description: { type: String, default: "" },
        viewdComapnies: { type: Array, default: [] },
        reviews: { type: Array, default: [] },
        category: { type: String, default: "" },
        jobDescription: { type: String, default: "" },
        selectedTemplate:{type:String},
    },
    { collection: "CoverLetter" }
)
const model = mongoose.model("CoverLetter", CoverLetterSchema);

module.exports = model;
