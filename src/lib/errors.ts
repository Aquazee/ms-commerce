import httpStatus from 'http-status';

export const UserError = {
  UserNotFound: {
    error: 'UserNotFound',
    message: 'User not found',
    status: httpStatus.NOT_FOUND,
  },

  EmailTaken: {
    error: 'EmailTaken',
    message: 'Email already taken',
    status: httpStatus.CONFLICT,
  },
};

export const ProductError = {
  ProductNotFound: {
    error: 'ProductNotFound',
    message: 'Product not found',
    status: httpStatus.NOT_FOUND,
  },
};
