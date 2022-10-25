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

  UserBlocked: {
    error: 'UserBlocked',
    message: 'User is Blocked',
    status: httpStatus.UNAUTHORIZED,
  },

  UserInactive: {
    error: 'UserInactive',
    message: 'User is Inactive, Please reactivate your account.',
    status: httpStatus.UNAUTHORIZED,
  },

  InvalidId: {
    error: 'InvalidId',
    message: 'Invalid Id.',
    status: httpStatus.BAD_REQUEST,
  },

  InvalidToken: {
    error: 'InvalidToken',
    message: 'Invalid Token.',
    status: httpStatus.BAD_REQUEST,
  },

  InvalidPassword: {
    error: 'InvalidPassword',
    message: 'Invalid Password.',
    status: httpStatus.BAD_REQUEST,
  },

  InvalidEmailVerification: {
    error: 'InvalidEmailVerification',
    message: 'Invalid Email Verification.',
    status: httpStatus.BAD_REQUEST,
  },
};

export const ProductError = {
  ProductNotFound: {
    error: 'ProductNotFound',
    message: 'Product not found',
    status: httpStatus.NOT_FOUND,
  },
  ProductInactive: {
    error: 'ProductInactive',
    message: 'Product is Inactive.',
    status: httpStatus.BAD_REQUEST,
  },
  ProductCustomLabelTaken: {
    error: 'Product CustomLabelTaken',
    message: 'Product custom label taken.',
    status: httpStatus.BAD_REQUEST,
  },
  ProductTitleTaken: {
    error: 'ProductTitleTaken',
    message: 'Product title taken.',
    status: httpStatus.BAD_REQUEST,
  },
};
