import Joi from 'joi';

export const bodyUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'gmail'] },
    })
    .required(),
  password: Joi.string().min(8).max(30).required(),
});

export const subscriptionUserSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

export const verifySchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'gmail'] },
    })
    .required(),
});
