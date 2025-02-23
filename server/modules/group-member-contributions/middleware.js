const validateResearchInterests = async (req, res, next) => {
    // Getting the research interest from the client side
    const { researchInterests } = req.body;

    // Checking the research interests are not empty
    if (!researchInterests || researchInterests.length === 0) {
        return res.status(400).json({ message: 'Research interests must have at least 1 and at most 5 items.' });
    }

    // Checking the research interests are an array
    if (!Array.isArray(researchInterests)) {
        return res.status(400).json({ message: 'Research interests must be an array.' });
    }

    // Checking that the provided research interests are between 1 and 5
    if (researchInterests.length > 5) {
        return res.status(400).json({ message: 'Research interests must have at most 5 items.' });
    }

    // Checking that the interests are unique
    const uniqueResearchInterests = [...new Set(researchInterests)];
    if (uniqueResearchInterests.length !== researchInterests.length) {
        return res.status(400).json({ message: 'Research interests must be unique.' });
    }

    // Pass control to the next middleware or controller
    next();
};

module.exports = validateResearchInterests;
