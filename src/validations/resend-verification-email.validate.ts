import joi from 'joi';
import CommonValidate from './common.validate';

const getUser = joi.object({
  email: CommonValidate.EmailValidate.required(),
});

export default getUser;
