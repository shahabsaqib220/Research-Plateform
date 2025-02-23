const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{12}$/, 'Phone number must be exactly 12 digits'],
  },
  research: [
    {
      startDate: String,
      endDate: String,
      tags: {
        type: [String],
        validate: {
          validator: arrayLimit,
          message: "Maximum 5 tags allowed",
        },
      },
      keywords: {
        type: [String],
        validate: {
          validator: arrayLimit,
          message: "Maximum 5 keywords allowed",
        },
      },
      journals: {
        type: [String],
        validate: {
          validator: arrayLimit,
          message: "Maximum 5 journals allowed",
        },
      },
      publicationLinks: {
        type: [String],
        validate: {
          validator: arrayLimit,
          message: "Maximum 5 publication links allowed",
        },
      },
      
      fileUrl: String, // Cloudinary file URL
      filePublicId: String, // Cloudinary file public ID
    },
  ],
  profileImageUrl: {
    type: String, // Storing the Cloudinary image URL
    default: null, // Default value if no image is uploaded
  },
  profileImagePublicId: {
    type: String,
    default: null, // Default value if no image is uploaded
  },
  coverImageUrl: { type: String, default: null },


  securityQuestions: [
    {
      type: String,
      required: true,
    },
  ],
  securityAnswers: [
    {
      type: String,
      required: true,
    },
  ],

});

// Validation function for array length
function arrayLimit(val) {
  return val.length <= 5;
}

// Pre-hook for hashing password and security answers before saving
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified('securityAnswers')) {
      const salt = await bcrypt.genSalt(10);
      this.securityAnswers = await Promise.all(
        this.securityAnswers.map((answer) => bcrypt.hash(answer, salt))
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare the password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate an authentication token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { user: { userId: this._id, email: this.email } },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Model creation
const User = mongoose.model('User', userSchema);

module.exports = User;
