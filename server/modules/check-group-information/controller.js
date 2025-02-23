const connectDB = require('../../db');
const Research = require('../admin-user-reseach-information/model'); // Adjust the path as necessary



connectDB();
// Check User Research Information
const checkUserResearchInfo = async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from request parameters

    // Find research information for the user
    const researchInfo = await Research.findOne({ userId });

    if (!researchInfo) {
      return res.status(200).json({ exists: false, message: "No research information found for this user." });
    }

    // If research information exists, return true along with the data
    return res.status(200).json({
      exists: true,
      message: "Research information found.",
      researchInfo, // Return the found research information
    });
  } catch (error) {
    console.error("Error checking research information:", error.message);
    return res.status(500).json({ exists: false, error: "Server error." });
  }
};


module.exports = {
  checkUserResearchInfo,
};