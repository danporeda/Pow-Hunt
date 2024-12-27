const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value })
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension);

module.exports.mountainSchema = Joi.object({
  mountain: Joi.object({
    name: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    price: Joi.string(),
    vertical: Joi.string(),
    acreage: Joi.string(),
    elevation: Joi.string(),
    snowfall: Joi.string(),
    pass: [Joi.array(), Joi.string()],
    images: Joi.string().allow(null, '')
  }),
  deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required().escapeHTML()
  })
})