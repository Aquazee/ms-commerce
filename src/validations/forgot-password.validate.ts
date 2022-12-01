import joi from 'joi';

const forgotPassword = joi.object({
  email: joi.string().required(),
});

export default forgotPassword;
