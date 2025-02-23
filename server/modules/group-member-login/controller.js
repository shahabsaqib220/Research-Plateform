// controller.js
const GroupMember = require('../admin-add-group-memeber/model'); // Assuming the model is stored in the models folder
const connectDB = require('../../db');
const bcrypt = require('bcrypt');
const { broadcastMessage } = require('../../websocketServer'); 
const {initGroupMemberGridFS }= require('../../configurations/firebase_Configuraion/memberProfileImageGridFs');
const mongoose = require('mongoose');
const { getGFS } = require('../../configurations/firebase_Configuraion/memberProfileImageGridFs');
let upload, gfs;
const { getGridFSBucket,  } = require('../../configurations/firebase_Configuraion/memberProfileImageGridFs');
const User = require('../userRegistration/userRegistrationModel');



connectDB();
initGroupMemberGridFS()
  .then(({ upload: _upload, gfs: _gfs }) => {
    upload = _upload;
    gfs = _gfs;
  })
  .catch((err) => console.error('Error initializing GridFS:', err));




  const groupMemberuploadProfileImage = async (req, res) => {
    try {
      const { memberId } = req.params;
  
      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Log the file details for debugging
  
      // Validate if the file is an image
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'The file uploaded is not an image' });
      }
  
      // Validate the file size (3 MB limit)
      if (req.file.size > 3 * 1024 * 1024) { // 3 MB = 3 * 1024 * 1024 bytes
        return res.status(400).json({ message: 'File size exceeds 3 MB limit' });
      }
  
      // Validate if the group member exists
      const groupMember = await GroupMember.findById(memberId);
      if (!groupMember) {
        return res.status(404).json({ message: 'Group member not found' });
      }
  
      // Initialize GridFS bucket for storing files
      const gfsBucket = getGridFSBucket();
      if (!gfsBucket) {
        return res.status(500).json({ message: 'GridFSBucket not initialized' });
      }
  
      // If the group member already has a profile image, delete the old one
      if (groupMember.profileImage) {
        const previousFileId = groupMember.profileImage;
  
        // Delete the previous profile image
        gfsBucket.delete(new mongoose.Types.ObjectId(previousFileId), (err) => {
          if (err) {
            console.error('Error deleting previous profile image:', err);
          } else {
            console.log('Previous profile image deleted:', previousFileId);
          }
        });
      }
  
      // Update the group member's profile image with the new file's ID
      groupMember.profileImage = req.file.id;
      await groupMember.save();
  
      // Broadcast a WebSocket message to update the profile image in real-time
      broadcastMessage({
        type: 'PROFILE_IMAGE_UPDATED',
        userId: groupMember._id,
        fileId: req.file.id,
      });
  
      // Respond with success message
      res.status(200).json({
        message: 'Profile image uploaded successfully',
        fileId: req.file.id,
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({
        message: 'Error uploading profile image',
        error: error.message,
      });
    }
  };

  // Defining the phone number controller function to add by the group member (group member phone number)

  const group_member_add_phone = async (req, res) => {
    // Getting the group member ID from the request parameters
    const { groupMemberId } = req.params;
  
    // Getting the phone number from the request body
    const { phoneNumber } = req.body;
  
    try {
      // Finding the group member by the ID
      const groupMember = await GroupMember.findById(groupMemberId);
  
      // If there is no group member, send a specific message to the client side
      if (!groupMember) {
        return res.status(400).json({ message: "Group memeber not found" });
      }
  
      // Normalize the phone number by removing any non-digit characters and ensuring it starts with +92
      const normalizePhoneNumber = (phone) => {
        // Remove all non-digit characters
        const digitsOnly = phone.replace(/\D/g, '');
  
        // If the number starts with 0, replace it with +92
        if (digitsOnly.startsWith('0')) {
          return `+92${digitsOnly.slice(1)}`;
        }
  
        // If the number doesn't start with +92, prepend it
        if (!digitsOnly.startsWith('92')) {
          return `+92${digitsOnly}`;
        }
  
        // If the number already starts with +92, return it as is
        return `+${digitsOnly}`;
      };
  
      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  
      // Check if the normalized phone number already exists in the database
      const existingPhoneNumber = await GroupMember.findOne({
        phoneNumber: { $regex: new RegExp(normalizedPhoneNumber.replace('+', '\\+'), 'i' )}
      });
  
      // If the phone number already exists, send a message to the client
      if (existingPhoneNumber) {
        return res.status(400).json({ message: "Phone Number is already used by some other user" });
      }
  
      // Save the normalized phone number to the group member
      groupMember.phoneNumber = normalizedPhoneNumber;
      await groupMember.save();
  
      // Send a success message to the client
      return res.status(200).json({ message: "Phone number is addedd successfully" });
    } catch (error) {
      console.error('Error adding phone number:', error);
      return res.status(500).json({ message: 'An error occurred while adding the phone number.' });
    }
  };




  // Defininf the group member add education section controller

  const group_member_add_education = async (req, res) => {
    const { groupMemberId } = req.params;
    const { education } = req.body; // Incoming education is an array
  
    try {
      // Finding the group member in the MongoDB database by ID
      const groupMember = await GroupMember.findById(groupMemberId);
      if (!groupMember) {
        return res.status(400).json({ message: "Group member not found" });
      }
  
      // Ensure that incoming education is an array
      if (!Array.isArray(education)) {
        return res.status(400).json({ message: "Education must be an array." });
      }
  
      // Check the current number of education entries
      let existingEducation = groupMember.education || [];
  
      // If the current education array already has 3 entries, do not allow more
      if (existingEducation.length >= 3) {
        return res.status(400).json({ message: "You can add up to 3 degrees only." });
      }
  
      // Add new education entries while keeping the max limit of 3
      for (let i = 0; i < education.length; i++) {
        if (existingEducation.length < 3) {
          existingEducation.push(education[i]); // Add to the next available index
        } else {
          break; // Stop if we already have 3 entries
        }
      }
  
      // Update and save the new education array
      groupMember.education = existingEducation;
      await groupMember.save();
  
      // Sending the success message to the frontend
      res.status(200).json({ message: "Education details updated successfully.", groupMember });
  
    } catch (error) {
      console.error("Error saving the education of the group member", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  


  // Controller function for getting the group memeber education information
  const get_group_member_education = async (req,res)=> {
    // We can getting the group member id from the frontend
    const {groupMemberId} = req.params;
    

    try {
      const groupMember = await GroupMember.findById(groupMemberId);
      // If the group member is not found then we can return the message to the client side or you can say front end
      if (!groupMember){
        return res.status(400).json({message:"Group Member not found"})
      }
     

      // If the group member is found then we can return the education details of the group member
      res.status(200).json({groupMember});

      // If you want to extract only the education details of the group member then you can do it like this, execute the below line, exclude the above line
      // res.status(200).json({groupMember:groupMember.education});
      
    } catch (error) {
      console.error("Error getting the group member education", error)
      res.status(500).json({message:"Internal server error"})
      
    }
    

  }

  // Controller function for the deleting the respective education for the group member:
const delete_group_member_education = async (req,res) =>{
  // Getting the group member Id from the front end
  const {groupMemberId, index} = req.body;
  console.log("I am the groupMemberID",groupMemberId);
  console.log("I am the index",index);
  //  so in the below try catch blick we can find the group member and delete the education if both are valid that is groupMemberId and the index to delte the education
  try {
    // Finding the group member throgh the Id:
    const groupMember = await GroupMember.findById(groupMemberId);

    // If the group member is not found then we can return the message to the front end
    if (!groupMember){
      return res.status(400).json({message:"Grounp Member not found"})
    }
    // checking the index is valid or exists in the group member eudcation array 
    if (index < 0 || index >= groupMember.education.length){
      return res.status(400).json({message:"Invalid Index for deleting"})
    }
    // removing the educational entry at the specific index
    groupMember.education.splice(index,1)

    // Saving the updated education array of the group member
    await groupMember.save();

    // So after saving the updated education array send back a success message to the front end

     res.status(200).json({message:"Education removed successfully",  education: groupMember.education})
    
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
  
}
  
  



  const groupMembergetProfileImage = async (req, res) => {
    try {
      const { profileImage } = req.params; // The file ID is passed as a parameter
      const gfsBucket = getGridFSBucket();
  
      if (!gfsBucket) {
        return res.status(500).json({ message: 'GridFSBucket is not initialized' });
      }
  
      if (!profileImage) {
        // If no profileImage is provided
        return res.status(404).json({ message: 'No profile image found' });
      }
  
      const fileId = new mongoose.Types.ObjectId(profileImage); // Convert ID to ObjectId
  
      // Check if the file exists in the bucket in real-time
      const filesCursor = gfsBucket.find({ _id: fileId });
      const files = await filesCursor.toArray();
  
      if (files.length === 0) {
        return res.status(404).json({ message: 'No profile image found' });
      }
  
      const file = files[0];
  
      // Check if the file is an image
      if (!file.contentType.startsWith('image/')) {
        return res.status(400).json({ message: 'Requested file is not an image' });
      }
  
      // Stream the file to the response in real-time
      res.set('Content-Type', file.contentType); // Set the correct content type
      const readStream = gfsBucket.openDownloadStream(fileId);
  
      // Pipe the file to the response
      readStream.pipe(res);
  
      // Handle stream errors
      readStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        res.status(500).json({ message: 'Error streaming file', error: err.message });
      });
  
      // Use broadcastMessage to notify WebSocket clients
      broadcastMessage({ message: `Profile image with ID ${profileImage} streamed successfully.` });
    } catch (error) {
      console.error('Error retrieving profile image:', error);
      res.status(500).json({
        message: 'Error retrieving profile image',
        error: error.message,
      });
    }
  };
  
  
  
  
  
  
  
  
  
// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
  
    const member = await GroupMember.findOne({ email });

    // If member not found, return an error
    if (!member) {
       // Log if member is not found
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password.trim(), member.password);
     // Log the result of password comparison

    // If passwords don't match, return an error
    if (!isMatch) {
     ;  // Log if password does not match
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token for the member using model method
    const token = member.memberGenerateToken();
     // Log the generated token

    // Send the response with token
    res.status(200).json({
      message: 'Login successful',
      token,
      member: {
        id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        profileImage: member.profileImage,
        addedBy: member.addedBy,
        phoneNumber : member.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getGroupInfo = async (req, res) => {
  try {
      const group = req.group; // Retrieved from middleware

      // Send the group information to the client
      res.status(200).json({ 
          message: "Group information retrieved successfully.", 
          group 
      });
  } catch (error) {
      console.error("Error retrieving group info:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};


const getGroupHeadContact = async (req,res) =>{
  try {
    const { addedById } = req.params;

    // Find user by addedBy ID and return only phone & email
    const user = await User.findById(addedById).select("phone email");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Respond with the user details
} catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
}
};



















module.exports = {
  login,
  groupMemberuploadProfileImage,
  groupMembergetProfileImage,
  getGroupInfo,
  get_group_member_education,
  delete_group_member_education,
  group_member_add_education,
  group_member_add_phone,
  getGroupHeadContact,
  upload, // Export upload middleware
};