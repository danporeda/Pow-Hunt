const Joi = require('joi');

module.exports.mountainSchema = Joi.object({
  mountain: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.string(),
    vertical: Joi.string(),
    acreage: Joi.string(),
    elevation: Joi.string(),
    snowfall: Joi.string(),
    pass: [Joi.array(), Joi.string()],
    // images: Joi.string().allow(null, '')
  }),
  deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required()
  })
})