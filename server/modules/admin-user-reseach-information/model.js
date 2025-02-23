const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema({
  researchName: { type: String, required: true },
  researchFields: { type: [String], required: true }, // Changed to array for multiple fields
  researchIntroduction: { type: String, required: true },
  researchTheme: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  socialMediaLinks: {
    linkedin: { type: String, required: true },
    website: { type: String }, // Optional
    googleScholar: { type: String, required: true },
  },
  groupDescription: {
    overview: { type: String, required: true },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Research', ResearchSchema);