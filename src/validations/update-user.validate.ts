import joi from 'joi';
import CommonValidate from './common.validate';

const updateUser = joi.object({
  userId: CommonValidate.IdValidate.optional(),
  user_name: CommonValidate.NameValidate.optional(),
  first_name: CommonValidate.NameValidate.optional(),
  last_name: CommonValidate.NameValidate.optional(),
  gender: CommonValidate.GenderValidate.optional(),
  email: CommonValidate.EmailValidate.optional(),
  password: CommonValidate.PasswordValidate.optional(),
  mobile: CommonValidate.MobileValidate.optional(),
  alt_mobile: CommonValidate.MobileValidate.optional(),
});

export default updateUser;
