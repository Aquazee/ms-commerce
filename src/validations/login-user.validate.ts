import joi from 'joi';
import CommonValidate from './common.validate';

const loginUser = joi.object({
  email: CommonValidate.EmailValidate.required(),
  password: CommonValidate.PasswordValidate.required(),
});

export default loginUser;
