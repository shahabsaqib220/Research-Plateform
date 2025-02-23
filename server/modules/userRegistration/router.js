const Otp = require('./model'); // Import model
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
const User = require('./userRegistrationModel')
const initGridFS = require('../../configurations/firebase_Configuraion/gridFsConfig');
const cloudinary = require('../../utils/cloudinaryConfig');


dotenv.config();




// Generate 6-digit OTP
const generateOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the email exists in the users collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log(otp);

    // Save OTP to the OTP collection with expiration time
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, expiresAt: Date.now() + 300 * 1000 },
      { upsert: true, new: true }
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Secure OTP Verification</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Hello,
          </p>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Thank you for using our service. Your One-Time Password (OTP) is:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #ffffff; background-color: #0096FF; padding: 10px 20px; border-radius: 5px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Please use this OTP to complete your verification. This OTP is valid for the next 5 minutes. Do not share it with anyone.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 14px; color: #888; line-height: 1.5; text-align: center;">
            If you did not request this OTP, please ignore this email or contact our support team for assistance.
          </p>
          <p style="font-size: 14px; color: #888; line-height: 1.5; text-align: center;">
            Regards, <br>
            <strong>Your Company Name</strong>
          </p>
        </div>
      `,
    });

    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};




const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};




const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      securityQuestions,
      securityAnswers,
      researchData,  // Array of research data
    } = req.body;

    const files = req.files;  // Get the uploaded files from request
    console.log('Files:', files);  // Log files to debug
    console.log('Form Data:', req.body);  // Log the rest of the form data

    // Parse security questions and answers
    const parsedSecurityQuestions = JSON.parse(securityQuestions);
    const parsedSecurityAnswers = JSON.parse(securityAnswers);

    // Find the user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      // If user doesn't exist, create a new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        research: [],  // Initialize empty research array
        securityQuestions: parsedSecurityQuestions,  // Store security questions
        securityAnswers: parsedSecurityAnswers,  // Store answers (hashed before saving)
      });

      // Loop through the research data and validate fields
      for (let i = 0; i < researchData.length; i++) {
        const researchItem = typeof researchData[i] === 'string' ? JSON.parse(researchData[i]) : researchData[i];
        const { startDate, endDate, tags, keywords, journals, publicationLinks } = researchItem;
        const file = files[i];  // Get the corresponding file

        // Parse the tags, keywords, journals, and publicationLinks fields
        const parsedTags = JSON.parse(tags);
        const parsedKeywords = JSON.parse(keywords);
        const parsedJournals = JSON.parse(journals);
        const parsedPublicationLinks = JSON.parse(publicationLinks);

        // Validate each field to ensure they have between 1 and 5 entries
        if (
          parsedTags.length < 1 || parsedTags.length > 5 ||
          parsedKeywords.length < 1 || parsedKeywords.length > 5 ||
          parsedJournals.length < 1 || parsedJournals.length > 5 ||
          parsedPublicationLinks.length < 1 || parsedPublicationLinks.length > 5
        ) {
          return res.status(400).json({
            error: 'Tags, Keywords, Journals, and Publication Links must have between 1 and 5 entries each',
          });
        }

        // Instead of uploading to Cloudinary, we use GridFS for file storage
        // The GridFsStorage is already handling file uploads
        const fileInfo = {
          filename: file.originalname,  // Original file name
          metadata: { userId: newUser._id },  // Additional metadata (optional)
        };

        // Add research entry to the user
        const newResearchEntry = {
          startDate,
          endDate,
          tags: parsedTags,
          keywords: parsedKeywords,
          journals: parsedJournals,
          publicationLinks: parsedPublicationLinks,
          fileUrl: fileInfo.filename,  // You can store file name or file ID
        };

        // Push new research entry to user's research array
        newUser.research.push(newResearchEntry);
      }

      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully', research: newUser.research });
    }

    // Validate that the user has less than 3 research entries
    if (user.research.length >= 3) {
      return res.status(400).json({ error: 'Maximum of 3 form submissions allowed' });
    }

    // Loop through the research data and validate fields
    for (let i = 0; i < researchData.length; i++) {
      const researchItem = typeof researchData[i] === 'string' ? JSON.parse(researchData[i]) : researchData[i];
      const { startDate, endDate, tags, keywords, journals, publicationLinks } = researchItem;
      const file = files[i];  // Get the corresponding file

      // Parse the tags, keywords, journals, and publicationLinks fields
      const parsedTags = JSON.parse(tags);
      const parsedKeywords = JSON.parse(keywords);
      const parsedJournals = JSON.parse(journals);
      const parsedPublicationLinks = JSON.parse(publicationLinks);

      // Validate each field to ensure they have between 1 and 5 entries
      if (
        parsedTags.length < 1 || parsedTags.length > 5 ||
        parsedKeywords.length < 1 || parsedKeywords.length > 5 ||
        parsedJournals.length < 1 || parsedJournals.length > 5 ||
        parsedPublicationLinks.length < 1 || parsedPublicationLinks.length > 5
      ) {
        return res.status(400).json({
          error: 'Tags, Keywords, Journals, and Publication Links must have between 1 and 5 entries each',
        });
      }

      // Same file upload as earlier
      const fileInfo = {
        filename: file.originalname,
        metadata: { userId: user._id },
      };

      // Add research entry to the user
      const newResearchEntry = {
        startDate,
        endDate,
        tags: parsedTags,
        keywords: parsedKeywords,
        journals: parsedJournals,
        publicationLinks: parsedPublicationLinks,
        fileUrl: fileInfo.filename,  // Store filename or metadata
      };

      // Push new research entry to user's research array
      user.research.push(newResearchEntry);
    }

    // Save updated user with new research data
    await user.save();

    // Return success message
    res.status(200).json({
      message: 'Form submitted successfully',
      research: user.research,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};











module.exports = { generateOtp, verifyOtp, registerUser };
