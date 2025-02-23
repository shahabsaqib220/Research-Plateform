const Research = require('../../modules/admin-user-reseach-information/model'); // Assuming Research is the correct model for the researches collection

const checkGroupInfo = async (req, res, next) => {
    try {
        console.log("I am the Id of the Group Head:", req.params.addedBy);
        const { addedBy } = req.params; // Extract addedBy from the route parameters

        // Query the researches collection to find a document with the matching userId
        const group = await Research.findOne({ userId: addedBy });

        if (!group) {
            return res.status(404).json({ message: "No group information found for the provided addedBy ID." });
        }

        // Attach the group information to the request object for the next middleware/controller
        req.group = group;
        next();
    } catch (error) {
        console.error("Error checking group info:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = checkGroupInfo;
