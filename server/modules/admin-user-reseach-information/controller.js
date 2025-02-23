const connectDB = require('../../db');
const Research = require('../admin-user-reseach-information/model');
const User = require('../userRegistration/userRegistrationModel');





connectDB();


const getResearch = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the user is authenticated

    // Find research information for the user
    const research = await Research.findOne({ userId });

    if (!research) {
      return res.status(404).json({ message: 'No research information found for this user' });
    }

    res.status(200).json({ research });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch research information' });
  }
};




const addOrUpdateResearch = async (req, res) => {
  try {
    const {
      researchName,
      researchFields,
      researchIntroduction,
      researchTheme,
      institution,
      location,
      socialMediaLinks,
      groupDescription,
    } = req.body;

    const userId = req.user.userId;

    // Validate required fields
    if (
      !researchName ||
      !researchFields ||
      !researchIntroduction ||
      !researchTheme ||
      !institution ||
      !location ||
      !socialMediaLinks.linkedin ||
      !socialMediaLinks.googleScholar ||
      !groupDescription.overview ||
      !groupDescription.mission ||
      !groupDescription.vision
    ) {
      return res.status(400).json({ message: 'All fields are required except website URL.' });
    }

    let research = await Research.findOne({ userId });

    if (research) {
      // Update only provided fields
      research.researchName = researchName || research.researchName;
      research.researchFields = researchFields || research.researchFields;
      research.researchIntroduction = researchIntroduction || research.researchIntroduction;
      research.researchTheme = researchTheme || research.researchTheme;
      research.institution = institution || research.institution;
      research.location = location || research.location;
      research.socialMediaLinks = {
        linkedin: socialMediaLinks.linkedin || research.socialMediaLinks.linkedin,
        website: socialMediaLinks.website || research.socialMediaLinks.website, // Optional
        googleScholar: socialMediaLinks.googleScholar || research.socialMediaLinks.googleScholar,
      };
      research.groupDescription = {
        overview: groupDescription.overview || research.groupDescription.overview,
        mission: groupDescription.mission || research.groupDescription.mission,
        vision: groupDescription.vision || research.groupDescription.vision,
      };

      await research.save();
      return res.status(200).json({ message: 'Research information updated successfully', research });
    }

    // Create new research information if none exists
    research = new Research({
      researchName,
      researchFields,
      researchIntroduction,
      researchTheme,
      institution,
      location,
      socialMediaLinks,
      groupDescription,
      userId,
    });

    await research.save();
    await User.findByIdAndUpdate(userId, { $push: { research: research._id } });

    res.status(201).json({ message: 'Research information added successfully', research });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while saving research information.', error });
  }
};


module.exports = {getResearch, addOrUpdateResearch };
