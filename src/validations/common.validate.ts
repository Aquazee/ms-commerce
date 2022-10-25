import joi from 'joi';

const AddressValidate = joi
  .object({
    line_1: joi.string().min(3).max(30).optional(),
    line_2: joi.string().min(3).max(30).optional(),
    postal_code: joi.string().min(0).max(10).optional(),
    city: joi.string().min(3).max(100).optional(),
    state: joi.string().min(3).max(100).optional(),
    pin_code: joi.string().min(3).max(100).optional(),
    country: joi.string().min(3).max(100).optional(),
    landmark: joi.string().min(3).max(100).optional(),
    type: joi.number().min(3).max(100).optional(),
    default: joi.number().min(1).max(1).optional(),
  })
  .optional();

const MobileValidate = joi
  .string()
  .length(10)
  .pattern(/[0-9]{9}/);

const EmailValidate = joi.string().email().trim(true);

const IdValidate = joi.string().alphanum().min(24).max(24).trim(true);

const PasswordValidate = joi
  .string()
  .min(8)
  .trim(true)
  .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)
  .required()
  .label(
    'Password should contains a number, symbol, alphabets and atleast 8 characters'
  );

const GenderValidate = joi.string().trim(true).valid(0, 1);

const GuidValidate = joi.string().guid().trim(true);

const NameValidate = joi.string().alphanum().min(3).max(25).trim(true);

export default {
  AddressValidate,
  MobileValidate,
  PasswordValidate,
  EmailValidate,
  NameValidate,
  GenderValidate,
  IdValidate,
  GuidValidate,
};
