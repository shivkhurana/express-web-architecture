const Joi = require('joi');

const schema = Joi.object({
  external_id: Joi.string().max(128).required(),
  data: Joi.object().required(),
  metadata: Joi.object().optional(),
});

module.exports = function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid payload', details: error.details });
  }
  next();
};
