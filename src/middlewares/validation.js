const Joi = require("joi");

const lineNameSchema = Joi.object({
  lineName: Joi.string()
    .required()
    .valid(
      "bakerloo",
      "central",
      "circle",
      "district",
      "hammersmith-city",
      "jubilee",
      "metropolitan",
      "northern",
      "piccadilly",
      "victoria",
      "waterloo-city"
    )
    .insensitive()
    .lowercase(),
}).unknown(false);

const validateQuery = (schema) => {
  return (req, res, next) => {
    // Only alowed to use one lineName at a time
    if (Array.isArray(req.query.lineName)) {
      req.query.lineName = req.query.lineName[0];
      console.warn(
        `Multiple lineName values provided, using only the first: ${req.query.lineName}`
      );
    }

    const { error, value } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Ensure the value is properly lowercased
    // (this is redundant with .lowercase() above but provides an extra guarantee)
    if (value.lineName) {
      value.lineName = value.lineName.toLowerCase();
    }

    req.validatedQuery = value;
    next();
  };
};

module.exports = {
  validateLineNameQuery: validateQuery(lineNameSchema),
};
