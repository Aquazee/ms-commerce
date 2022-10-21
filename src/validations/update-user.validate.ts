import joi from 'joi';

const updateUser = joi.object({
  user_name: joi.string().alphanum().min(3).max(25).trim(true).optional(),
  name: joi.string().alphanum().min(3).max(25).trim(true).optional(),
  email: joi.string().email().trim(true).optional(),
  password: joi
    .string()
    .min(8)
    .trim(true)
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)
    .optional(),
  mobile: joi
    .string()
    .length(10)
    .pattern(/[0-9]{9}/)
    .required(),
  address: joi
    .object({
      line_1: joi.string().min(3).max(30).optional(),
      line_2: joi.string().min(3).max(30).optional(),
      postal_code: joi.string().min(0).max(10).optional(),
      city: joi.string().min(3).max(100).optional(),
      country: joi.string().min(3).max(100).optional(),
    })
    .optional(),
});

export default updateUser;
