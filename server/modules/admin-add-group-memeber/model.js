const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const groupMemberSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },

  phoneNumber:{
    type:String,
  
    unique:true,
    default:null
  },



  password: { type: String, required: true },
  profileImage: { type: mongoose.Schema.Types.ObjectId, default: null }, // Updated to ObjectId
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //  Defining  the group member educational infomration into our model schema:

  education: {
    type: [
      {
        degree: { type: String, default: null },
        field: { type: String, default: null },
        institution: { type: String, default: null },
        startDate: { type: String, default: null },
        endDate: { type: String, default: null }
      }
    ],
    default: [] // Ensure education is always at least an empty array
  }

}, { timestamps: true });



// Hash password before saving
groupMemberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('Password hashed:', this.password); // Log hashed password for debugging
  next();
});

// Compare password method
groupMemberSchema.methods.comparePassword = async function (candidatePassword) {
  console.log('Comparing passwords:', candidatePassword, this.password); // Log for debugging
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate Auth Token for Group Members
groupMemberSchema.methods.memberGenerateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.GROUP_MEMBER_JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = mongoose.model('GroupMember', groupMemberSchema);