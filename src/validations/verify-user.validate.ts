import joi from 'joi';
import CommonValidate from './common.validate';

const verifyUser = joi.object({
  userId: CommonValidate.IdValidate.optional(),
  type: CommonValidate.IdValidate.required(),
  fcode: CommonValidate.GuidValidate.required(),
});

export default verifyUser;
