import joi from 'joi';

const getUser = joi.object({
  userId: joi.string().alphanum().min(24).max(24).trim(true).required(),
});

export default getUser;
