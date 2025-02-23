const initGridFS = require('../../configurations/firebase_Configuraion/gridFsConfig');
const connectDB = require('../../db');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const GroupMember = require('../admin-add-group-memeber/model');
const User = require('../userRegistration/userRegistrationModel'); // Assuming there's a user model
const { getGridFSBucket,  } = require('../../configurations/firebase_Configuraion/memberProfileImageGridFs');
const { sendEmail } = require('../../utils/nodemailer');
const Research = require('../admin-user-reseach-information/model'); // 




connectDB();
const { upload, gfs } = initGridFS();

// Add Group Member
const addGroupMember = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, addedBy } = req.body;

    if (!firstName || !email || !password || !confirmPassword || !addedBy) {
      return res.status(400).json({ error: "All fields are required: firstName, email, password, confirmPassword, and addedBy." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (req.user.email === email) {
      return res.status(400).json({ error: "You cannot add yourself as a member." });
    }

    const existingMember = await GroupMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ error: "A member with this email already exists." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password and Confirm Password must match." });
    }

    const newMember = new GroupMember({
      firstName,
      lastName: lastName || null,
      email,
      password,
      addedBy,
    });

    await newMember.save();

    const researchInfo = await Research.findOne({ userId: addedBy });

    const groupInfo = researchInfo
    ? `
      <div style="margin-top: 10px;">
        <p style="margin: 8px 0;"><strong>Research Name:</strong> ${researchInfo.researchName}</p>
        <p style="margin: 8px 0;"><strong>Fields:</strong> ${researchInfo.researchFields.join(', ')}</p>
        <p style="margin: 8px 0;"><strong>Institution:</strong> ${researchInfo.institution}</p>
        <div style="margin-top: 15px;">
          <a href="${researchInfo.socialMediaLinks.linkedin}" style="display: inline-flex; align-items: center; color: #2B6CB0; text-decoration: none; margin-right: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 5px;">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
          <a href="${researchInfo.socialMediaLinks.googleScholar}" style="display: inline-flex; align-items: center; color: #2B6CB0; text-decoration: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 5px;">
              <path d="M12 24a12 12 0 1 1 0-24 12 12 0 0 1 0 24zm-1.19-5v-6.08c-1.35.86-2.37 1.7-3.06 2.52-.5.6-.86 1.14-1.09 1.62-.22.48-.34.98-.34 1.5h-2.1c0-1.06.23-2.05.68-2.96.45-.92 1.2-1.82 2.25-2.7 1.05-.89 2.41-1.65 4.07-2.3V6.94l-3.75 2.18-1.13-1.64L12 4.7l5.98 3.78-1.13 1.64-3.75-2.18V19h-2.13z"/>
            </svg>
            Google Scholar
          </a>
        </div>
      </div>
    `
    : "<p>No group information available.</p>";

    await sendEmail(email, firstName, lastName, password, groupInfo);

    res.status(201).json({
      message: "Group member added successfully.",
      member: {
        id: newMember._id,
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        email: newMember.email,
        addedBy: newMember.addedBy,
      },
    });
  } catch (error) {
    console.error("Error adding group member:", error.message);
    res.status(500).json({ error: "Server error." });
  }
};


// Getting the respectively groupmember profile Image in the Head User DashBoard
const groupMembergetProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.params; // The file ID is passed as a parameter
    const gfsBucket = getGridFSBucket();

    if (!gfsBucket) {
      return res.status(500).json({ message: 'GridFSBucket is not initialized' });
    }

    const fileId = new mongoose.Types.ObjectId(profileImage); // Convert ID to ObjectId

    // Check if the file exists in the bucket
    const filesCursor = gfsBucket.find({ _id: fileId });
    const files = await filesCursor.toArray();

    if (files.length === 0) {
      return res.status(404).json({ message: 'File not found in GridFS' });
    }

    const file = files[0];

    // Check if the file is an image
    if (!file.contentType.startsWith('image/')) {
      return res.status(400).json({ message: 'Requested file is not an image' });
    }

    // Stream the file to the response
    res.set('Content-Type', file.contentType); // Set the correct content type
    const readStream = gfsBucket.openDownloadStream(fileId);
    readStream.pipe(res);

    // Handle stream errors
    readStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ message: 'Error streaming file', error: err.message });
    });
  } catch (error) {
    console.error('Error retrieving profile image:', error);
    res.status(500).json({
      message: 'Error retrieving profile image',
      error: error.message,
    });
  }
};


// Get all members added by the user
const getMyGroupMembers = async (req, res) => {
  try {
    // Log the user ID from token to confirm it's correct
    console.log("User ID from Token:", req.user.userId);

    // Fetch members added by the logged-in user and populate the addedBy field with user information
    const members = await GroupMember.find({ addedBy: req.user.userId })
      .populate('addedBy', 'firstName lastName email') // Populate the 'addedBy' field with the user's details (fields to populate can be adjusted)
      .exec();

    // Check if no members are found
    if (members.length === 0) {
      return res.status(404).json({ message: "No group members found." });
    }

    // Return the members if found
    res.status(200).json({
      message: "Group members retrieved successfully.",
      members,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching group members:", error.message);

    // Return a generic server error message
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};






const removeGroupMember = async (req, res) => {
  try {
    const { memberId, email, password } = req.body; // Extract data from the request
    const { userId, email: headEmail } = req.user; 
    
    console.log("Request Body:", req.body);
    console.log("User  ID:", userId);
    console.log("Head Email:", headEmail); // Extract group head data from auth middleware

    // Step 1: Verify the group head's password
    const headUser  = await User.findOne({ _id: userId, email: headEmail });
    if (!headUser ) {
      console.error('Unauthorized access: Head user not found');
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const isPasswordCorrect = await headUser .comparePassword(password);
    if (!isPasswordCorrect) {
      console.error('Invalid password for user:', headEmail);
      return res.status(403).json({ message: 'Invalid password' });
    }

    // Step 2: Find the group member by email and ID
    const member = await GroupMember.findOne({
      _id: memberId,
      email: email,
      addedBy: userId, // Ensure this member was added by the current head
    });

    if (!member) {
      console.error('Member not found or not added by this head:', memberId, email);
      return res.status(404).json({ message: 'Member not found or not added by this head' });
    }

    // Step 3: Remove the member from the group
    await GroupMember.findByIdAndDelete(memberId);
    console.log('Member removed successfully:', memberId);

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing group member:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateGroupMember = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const { id: groupMemberId } = req.params; // Use 'id' from the route params
    const { userId } = req.user; // Extracted from auth 
    
    console.log("I am the first name needs to modify", firstName)
    console.log("I am the last name needs to modify", lastName)
    console.log("I am the password needs to modify", password)

    console.log("I am the group member ID", groupMemberId);

    console.log("I am the head User ID", userId)

    // Verify head user's password
    const headUser = await User.findById(userId);
    if (!headUser) return res.status(404).json({ message: 'Head user not found' });

    const isPasswordValid = await headUser.comparePassword(req.body.headPassword);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid Password' });

    // Find the group member and verify the addedBy field
    const groupMember = await GroupMember.findById(groupMemberId);
    if (!groupMember) return res.status(404).json({ message: 'Group member not found' });

    if (groupMember.addedBy.toString() !== userId)
      return res.status(403).json({ message: 'Unauthorized to update this group member' });

    // Update only the fields provided
    if (firstName) groupMember.firstName = firstName;
    if (lastName) groupMember.lastName = lastName;
    if (password) groupMember.password = password; // Schema will hash this automatically

    // Save the updated document (triggers the `pre('save')` middleware)
    const updatedMember = await groupMember.save();

    return res.status(200).json({ message: 'Group member updated successfully', data: updatedMember });
  } catch (error) {
    console.error('Error updating group member:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};










module.exports = {addGroupMember, getMyGroupMembers, removeGroupMember, updateGroupMember, groupMembergetProfileImage}


