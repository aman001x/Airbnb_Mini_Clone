const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().min(0).required(),
    location: Joi.string().max(255).required(),
    country: Joi.string().max(255).required(),
    image: Joi.string().uri().optional().allow('', null),
  }).required(),
});

module.exports = { listingSchema }; // Named export

module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),

});