import joi from 'joi';
import CommonValidate from './common.validate';

const verifyUser = joi.object({
  userId: CommonValidate.IdValidate.required(),
  type: CommonValidate.IdValidate.optional(),
  fcode: CommonValidate.GuidValidate.required(),
});

export default verifyUser;
