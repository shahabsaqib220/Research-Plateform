const mongoose = require("mongoose");

const groupMemberContributionSchema = new mongoose.Schema({
    groupMemberId:{
        type: mongoose.Schema.Types.ObjectId,
        // Refers to the GroupMember model, or getting the GroupMember Id when some group member can add the cqontribution
        // to the group
        ref: 'GroupMember',
        required: true
    },
    addedBy:{
        type: mongoose.Schema.Types.ObjectId,
        // Refers to the Head Admin model, or getting the Head admin Id when some group member can add the  contribution to the group
        // So it is easier to populate the head admin details when we need.
        ref: 'User',
        required: true
    },
    designation: {
        type: String,
        required: true,
      },
      researchInterests: {
        type: [String],
        validate: {
          validator: function (arr) {
            return arr.length >= 1 && arr.length <= 5;
          },
          message: 'Research interests must have at least 1 and at most 5 items.'
        }
     },

    role: {
        type: String,
        required: true,
      },
},{ timestamps: true })

// Exporting the model schema for the contrbution for the group member
// to use it into another places
module.exports = mongoose.model('GroupMemberContribution', groupMemberContributionSchema)