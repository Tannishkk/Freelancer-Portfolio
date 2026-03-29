const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    templateId: {
        type: String,
        default: "minimalLight"
    },
    name: String,
    title: String,
    photo: String,
    charges: String,
    github: String,
    linkedin: String,
    skills: [String],
    experience: String,
    projects: [
        {
            name: String,
            description: String,
            link: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Portfolio", portfolioSchema);