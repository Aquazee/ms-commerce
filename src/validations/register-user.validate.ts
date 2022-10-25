import joi from 'joi';
import CommonValidate from './common.validate';

const registerUser = joi.object({
  first_name: CommonValidate.NameValidate.optional(),
  last_name: CommonValidate.NameValidate.optional(),
  user_name: CommonValidate.NameValidate.optional(),
  email: CommonValidate.EmailValidate.required(),
  password: CommonValidate.PasswordValidate.required(),
  mobile: CommonValidate.MobileValidate.optional(),
  address: CommonValidate.AddressValidate.optional(),
});

export default registerUser;
