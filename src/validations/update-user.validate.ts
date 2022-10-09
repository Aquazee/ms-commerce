import joi from 'joi';

const updateUser = joi.object({
  userName: joi.string().alphanum().min(3).max(25).trim(true).optional(),
  name: joi.string().alphanum().min(3).max(25).trim(true).optional(),
  email: joi.string().email().trim(true).optional(),
  password: joi.string().min(8).trim(true).optional(),
  mobileNumber: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  address: joi.number().integer().min(1920).max(2000).optional(),
  postcode: joi.number().integer().min(1920).max(2000).optional(),
  city: joi.number().integer().min(1920).max(2000).optional(),
  country: joi.number().integer().min(1920).max(2000).optional(),
  is_active: joi.boolean().optional(),
});

export default updateUser;
