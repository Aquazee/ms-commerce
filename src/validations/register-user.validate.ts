import joi from 'joi';

const updateUser = joi.object({
  user_name: joi.string().alphanum().min(3).max(25).trim(true).optional(),
  name: joi.string().alphanum().min(3).max(25).trim(true).optional(),
  email: joi.string().email().trim(true).optional(),
  password: joi.string().min(8).trim(true).optional(),
  mobile: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  address: joi
    .object({
      line_1: joi.string().min(3).max(30).optional(),
      line_2: joi.string().min(3).max(30).optional(),
      postal_code: joi.number().integer().min(1920).max(2000).optional(),
      city: joi.string().min(3).max(100).optional(),
      country: joi.string().min(3).max(100).optional(),
    })
    .optional(),
});

export default updateUser;
