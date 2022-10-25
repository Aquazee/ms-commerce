import joi from 'joi';
import CommonValidate from './common.validate';

const getUser = joi.object({
  userId: CommonValidate.IdValidate.required(),
});

export default getUser;
