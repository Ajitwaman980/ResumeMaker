const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  Skills: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  experience_position: {
    type: String,
    required: true,
  },
  experience_company: {
    type: String,
    required: true,
  },
  experience_startDate: {
    type: String,
    required: true,
  },
  experience_endDate: {
    type: String,
    required: true,
  },
  experience_description: {
    type: String,
    required: true,
  },
  education_degree: {
    type: String,
    required: true,
  },
  education_institution: {
    type: String,
    required: true,
  },
  education_startDate: {
    type: String,
    required: true,
  },
  education_endDate: {
    type: String,
    required: true,
  },
  education_description: {
    type: String,
    required: true,
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }, // Refer the owner user id
  tenth_marks: {
    type: String,
    required: true,
  },
  tenth_college: {
    type: String,
    required: true,
  },
  twelfth_marks: {
    type: String,
    required: true,
  },
  twelfth_college: {
    type: String,
    required: true,
  },
  hobbies: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  twitter: {
    type: String,
  },
  leetcode: {
    type: String,
  },
  hackerrank: {
    type: String,
  },
}, {
  timestamps: true 
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
