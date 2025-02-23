const Joi = require('joi');

const validateUserData = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().required(),
    securityQuestions: Joi.array().items(Joi.string()).length(3).required(),
    securityAnswers: Joi.array().items(Joi.string()).length(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = validateUserData;
