const Contributions = require('./model');
const GroupMember = require('../admin-add-group-memeber/model');
const connectDB = require('../../db');

connectDB();

const createContribution = async (req, res) => {
    // Getting all the data from the client side to store in the database
    const { groupMemberId, designation, researchInterests, role } = req.body;
    console.log(req.body);

    try {
        // Fetching the group member details from the database
        const groupMember = await GroupMember.findById(groupMemberId);

        // If no group member is found with the provided ID
        if (!groupMember) {
            return res.status(404).json({ message: "Group member not found" });
        }

        // Fetching the addedBy ID from the group member document
        const addedBy = groupMember.addedBy;

        // Check if a contribution already exists for this group member and admin
        const existingContribution = await Contributions.findOne({
            groupMemberId,
            addedBy,
        });

        if (existingContribution) {
            // Update the existing contribution
            existingContribution.designation = designation;
            existingContribution.researchInterests = researchInterests;
            existingContribution.role = role;

            await existingContribution.save();

            return res.status(200).json({ message: "Contribution updated successfully" });
        } else {
            // Create a new contribution
            const newContribution = new Contributions({
                groupMemberId, // ID of the group member
                addedBy, // ID of the admin who added the group member
                designation,
                researchInterests,
                role,
            });

            await newContribution.save();

            return res.status(201).json({ message: "Contribution created successfully" });
        }
    } catch (error) {
        console.error('Error creating/updating contribution:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Creating the controller function to get the contribution data 
// of the group member from the database
const get_group_member_contribution = async (req, res) => {
    // getting the group member id from the client side or front end
    const {groupMemberId} = req.params;

    try {
        // Getting the group member contribution from the database
        const groupMemberContribution = await Contributions.findOne({groupMemberId});

        // If no contribution is found for the group member
        if (!groupMemberContribution){
            return res.status(404).json({message: "Contribution not found"});
        }

        // Othersie, return the contribution data to the client side
        return res.status(200).json({message:"Contribution found", groupMemberContribution});
        
    } catch (error) {
        // If there is an error, return an internal server error
        console.log('Error getting group member contribution:', error);
        return res.status(500).json({message: 'Internal server error'});
        
    }
    
}




// Exporting the module for use in other places
module.exports = { createContributions: createContribution, get_group_member_contribution };